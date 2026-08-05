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
end
