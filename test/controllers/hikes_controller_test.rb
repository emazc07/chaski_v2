require "test_helper"

class HikesControllerTest < ActionDispatch::IntegrationTest
  test "should get mine" do
    get hikes_mine_url
    assert_response :success
  end
end
