require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "normalizes whatsapp phone to digits" do
    user = users(:hiker)
    user.whatsapp_phone = "+506 8888-7777"
    assert user.valid?
    assert_equal "50688887777", user.whatsapp_phone
  end

  test "rejects invalid whatsapp phone" do
    user = users(:hiker)
    user.whatsapp_phone = "abc"
    assert_not user.valid?
  end

  test "destroying user destroys their user badges" do
    user = users(:hiker)
    user_badge = user_badges(:hiker_first_hike)
    badge = user_badge.badge

    assert_difference "UserBadge.count", -1 do
      user.destroy!
    end

    assert_not UserBadge.exists?(user_badge.id)
    assert Badge.exists?(badge.id)
  end
end
