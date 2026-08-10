require "test_helper"

class UserBadgeTest < ActiveSupport::TestCase
  test "requires earned_at" do
    user_badge = UserBadge.new(
      user: users(:organizer),
      badge: badges(:inactive_destination),
      earned_at: nil
    )

    assert_not user_badge.valid?
    assert user_badge.errors[:earned_at].present?
  end

  test "does not allow the same user to earn a badge twice" do
    existing = user_badges(:hiker_first_hike)

    duplicate = UserBadge.new(
      user: existing.user,
      badge: existing.badge,
      earned_at: Time.current
    )

    assert_not duplicate.valid?
    assert duplicate.errors[:badge_id].present?
  end

  test "allows event to be absent" do
    user_badge = UserBadge.new(
      user: users(:organizer),
      badge: badges(:first_hike),
      event: nil,
      earned_at: Time.current
    )

    assert user_badge.save, user_badge.errors.full_messages.join(", ")
  end

  test "connects users and badges through user badges" do
    user = users(:hiker)
    badge = badges(:first_hike)

    assert_includes user.badges, badge
    assert_includes badge.users, user
  end
end
