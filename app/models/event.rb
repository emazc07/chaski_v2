class Event < ApplicationRecord
  include Rails.application.routes.url_helpers

  belongs_to :organizer, class_name: "User"

  has_one_attached :cover_image

  has_many :inscriptions, dependent: :destroy
  has_many :hikers, through: :inscriptions, source: :user
  has_many :gear_items, dependent: :destroy

  accepts_nested_attributes_for :gear_items,
                                allow_destroy: true,
                                reject_if: proc { |attrs| attrs["name"].blank? }

  COVER_IMAGE_CONTENT_TYPES = %w[image/jpeg image/png image/webp].freeze
  COVER_IMAGE_MAX_BYTES = 5.megabytes

  validate :cover_image_must_be_valid, if: -> { cover_image.attached? }

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

  PROVINCE_LABELS = {
    "san_jose" => "San José",
    "alajuela" => "Alajuela",
    "cartago" => "Cartago",
    "heredia" => "Heredia",
    "guanacaste" => "Guanacaste",
    "puntarenas" => "Puntarenas",
    "limon" => "Limón"
  }.freeze

  scope :published, -> { where(status: :published) }
  scope :for_organizer, ->(user) { where(organizer: user) }
  scope :search, ->(q) {
    return all if q.blank?

    term = "%#{ActiveRecord::Base.sanitize_sql_like(q.to_s.strip)}%"
    where("custom_location ILIKE :t OR title ILIKE :t", t: term)
  }
  scope :by_difficulty, ->(value) {
    return all if value.blank?

    where(difficulty: value)
  }
  scope :by_zone, ->(zone) {
    return all if zone.blank?

    name = PROVINCE_LABELS[zone.to_s]
    return none unless name

    term = "%#{ActiveRecord::Base.sanitize_sql_like(name)}%"
    where("custom_location ILIKE ?", term)
  }
  scope :by_date, ->(preset) {
    return all if preset.blank?

    range =
      case preset.to_s
      when "week" then Time.current..1.week.from_now
      when "month" then Time.current..1.month.from_now
      else return all
      end

    where(starts_at: range)
  }

  def cover_image_card_url
    return nil unless cover_image.attached?

    rails_blob_path(
      cover_image.variant(resize_to_fill: [ 800, 450 ]),
      only_path: true
    )
  end

  def cover_image_hero_url
    return nil unless cover_image.attached?

    rails_blob_path(
      cover_image.variant(resize_to_limit: [ 1600, 900 ]),
      only_path: true
    )
  end

  private

  def cover_image_must_be_valid
    unless COVER_IMAGE_CONTENT_TYPES.include?(cover_image.content_type)
      errors.add(:cover_image, "debe ser JPEG, PNG o WebP")
    end

    if cover_image.byte_size > COVER_IMAGE_MAX_BYTES
      errors.add(:cover_image, "debe ser menor a 5 MB")
    end
  end

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
