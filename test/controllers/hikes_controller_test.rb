require "test_helper"

class HikesControllerTest < ActionDispatch::IntegrationTest
  test "should get mine" do
    get "/hikes/mine"
    assert_response :redirect
  end

  test "unauthenticated all redirects to sign in" do
    get "/hikes/mine/all"
    assert_response :redirect
  end
end
