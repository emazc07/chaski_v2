class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :organized_events, class_name: "Event",
                              foreign_key: :organizer_id,
                              dependent: :destroy,
                              inverse_of: :organizer

  has_many :inscriptions, dependent: :destroy
  has_many :inscribed_events, through: :inscriptions, source: :event                            

  validates :name, presence: true

  # Chaski schema 
  enum :experience_level, {
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
  }

  enum :frequency, {
    monthly: "monthly",
    biweekly: "biweekly",
    weekly: "weekly",
    more_often: "more_often",
  }

  def admin?
    admin
  end
end
