class Badge < ApplicationRecord
  has_many :user_badges,
           dependent: :restrict_with_error,
           inverse_of: :badge
  has_many :users, through: :user_badges

  enum :category, {
    milestone: "milestone",
    destination: "destination",
    special: "special",
    onboarding: "onboarding"
  }, validate: true

  scope :active, -> { where(active: true) }

  validates :name, :description, :icon, :category, :slug, presence: true
  validates :name, :slug, uniqueness: true
  validates :rule_key, uniqueness: true, allow_nil: true
  validates :active, inclusion: { in: [ true, false ] }
  validates :position,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            }

  before_validation :generate_slug, on: :create

  validate :slug_cannot_change, on: :update

  private

  def generate_slug
    return if slug.present? || name.blank?

    base = name.parameterize
    candidate = base
    suffix = 2

    while self.class.exists?(slug: candidate)
      candidate = "#{base}-#{suffix}"
      suffix += 1
    end

    self.slug = candidate
  end

  def slug_cannot_change
    return unless will_save_change_to_slug?

    errors.add(:slug, "no puede modificarse después de crear el badge")
  end
end
