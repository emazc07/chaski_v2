require "test_helper"

class HikesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @hiker = users(:hiker)
  end

  test "should get mine" do
    get "/hikes/mine"
    assert_response :redirect
  end

  test "unauthenticated all redirects to sign in" do
    get "/hikes/mine/all"
    assert_response :redirect
  end

  test "mine featured events omit past hikes" do
    sign_in @hiker
    past = events(:past_hike)

    get "/hikes/mine"

    assert_response :success
    assert_not_includes response.body, past.title
  end
end
