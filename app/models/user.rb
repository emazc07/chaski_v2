class User < ApplicationRecord
  include Rails.application.routes.url_helpers

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :timeoutable

  has_one_attached :avatar

  has_many :organized_events, class_name: "Event",
                              foreign_key: :organizer_id,
                              dependent: :destroy,
                              inverse_of: :organizer

  has_many :inscriptions, dependent: :destroy
  has_many :inscribed_events, through: :inscriptions, source: :event

  AVATAR_CONTENT_TYPES = %w[image/jpeg image/png image/webp].freeze
  AVATAR_MAX_BYTES = 5.megabytes

  validates :name, presence: true
  validate :avatar_must_be_valid, if: -> { avatar.attached? }

  # Chaski schema — string-backed enums (display in Spanish via i18n later)
  enum :experience_level, {
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced"
  }

  enum :frequency, {
    monthly: "monthly",
    biweekly: "biweekly",
    weekly: "weekly",
    more_often: "more_often"
  }

  def admin?
    admin
  end

  def avatar_url
    return nil unless avatar.attached?

    rails_blob_path(
      avatar.variant(resize_to_fill: [ 256, 256 ]),
      only_path: true
    )
  end

  private

  def avatar_must_be_valid
    unless AVATAR_CONTENT_TYPES.include?(avatar.content_type)
      errors.add(:avatar, "debe ser JPEG, PNG o WebP")
    end

    if avatar.byte_size > AVATAR_MAX_BYTES
      errors.add(:avatar, "debe ser menor a 5 MB")
    end
  end
end
