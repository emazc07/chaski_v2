require "test_helper"

class BadgesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @hiker = users(:hiker)
  end

  test "unauthenticated user is redirected to sign in" do
    get badges_url

    assert_redirected_to new_user_session_url
  end

  test "authenticated user can view badges page" do
    sign_in @hiker

    get badges_url

    assert_response :success
  end

  test "index includes only active badges" do
    sign_in @hiker
    active_badge = badges(:first_hike)

    get badges_url

    assert_inertia_component "badges/index"
    assert_inertia_props do |props|
      props[:badges].pluck(:id) == [ active_badge.id ]
    end
  end

  test "index orders active badges by position" do
    sign_in @hiker

    first_badge = badges(:first_hike)
    destination_badge = badges(:inactive_destination)
    destination_badge.update!(active: true, position: 0)

    get badges_url

    assert_inertia_props do |props|
      props[:badges].pluck(:id) == [
        destination_badge.id,
        first_badge.id
      ]
    end
  end

  test "index marks badges earned by current user" do
    sign_in @hiker

    earned_badge = badges(:first_hike)
    unearned_badge = badges(:inactive_destination)
    unearned_badge.update!(active: true)

    get badges_url

    assert_inertia_props do |props|
      badges_by_id = props[:badges].index_by { |badge| badge[:id] }

      badges_by_id[earned_badge.id][:earned] == true &&
        badges_by_id[unearned_badge.id][:earned] == false
    end
  end
  test "index includes the earned date" do
    sign_in @hiker

    badge = badges(:first_hike)
    user_badge = user_badges(:hiker_first_hike)

    get badges_url

    assert_inertia_props do |props|
      badge_props = props[:badges].find do |item|
        item[:id] == badge.id
      end

      badge_props[:earned_at] == user_badge.earned_at.iso8601
    end
  end

  test "index includes the badge image URL" do
    sign_in @hiker

    badge = badges(:first_hike)
    expected_image_url = ActionController::Base.helpers.asset_path(
      "badges/#{badge.icon}.png"
    )

    get badges_url

    assert_inertia_props do |props|
      badge_props = props[:badges].find do |item|
        item[:id] == badge.id
      end

      badge_props[:image_url] == expected_image_url
    end
  end
end
