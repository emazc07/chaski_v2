class UserBadge < ApplicationRecord
  belongs_to :user, inverse_of: :user_badges
  belongs_to :badge, inverse_of: :user_badges
  belongs_to :event, optional: true, inverse_of: :user_badges

  validates :earned_at, presence: true
  validates :badge_id, uniqueness: { scope: :user_id }
end
