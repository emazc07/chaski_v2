class Event < ApplicationRecord
  belongs_to :organizer, class_name: "User"

  has_many :inscriptions, dependent: :destroy
  has_many :hikers, through: :inscriptions, source: :user
  has_many :gear_items, dependent: :destroy

  accepts_nested_attributes_for :gear_items,
                                  allow_destroy: true,
                                  reject_if: proc { |attrs| attrs["name"].blank? }

  enum :difficulty, {
    easy: "easy",
    moderate: "moderate",
    hard: "hard",
    extreme: "extreme"
  }

  enum :route_type, {
    loop: "loop",
    out_and_back: "out_and_back",
    point_to_point: "point_to_point"
  }

  enum :status, {
    pending_review: "pending_review",
    published: "published",
    rejected: "rejected",
    cancelled: "cancelled",
    completed: "completed"
  }

  validates :title, :description_short, :description_long, :custom_location,
            :difficulty, :distance_km, :elevation_gain_m, :duration_hours,
            :route_type, :starts_at, :meeting_point, :max_participants,
            :slug, presence: true
  validates :description_short, length: { maximum: 160 }
  validates :max_participants, numericality: { only_integer: true, greater_than_or_equal_to: 2 }
  validates :slug, uniqueness: true

  before_validation :generate_slug, on: :create

  scope :published, -> { where(status: :published) }
  scope :for_organizer, ->(user) { where(organizer: user) }

  private

  def generate_slug
    return if slug.present? || title.blank?

    base = title.parameterize
    candidate = base
    suffix = 2

    while Event.exists?(slug: candidate)
      candidate = "#{base}-#{suffix}"
      suffix += 1
    end

    self.slug = candidate
  end
end
