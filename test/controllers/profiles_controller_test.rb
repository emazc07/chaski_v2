require "test_helper"

class ProfilesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @viewer = users(:organizer)
    @profile_user = users(:hiker)
  end

  test "unauthenticated user is redirected to sign in" do
    get public_profile_url(@profile_user)

    assert_redirected_to new_user_session_url
  end

  test "authenticated user can view another public profile" do
    sign_in @viewer

    get public_profile_url(@profile_user)

    assert_response :success
    assert_inertia_component "profiles/public_show"
  end

  test "public profile exposes only public user fields" do
    sign_in @viewer

    get public_profile_url(@profile_user)

    assert_inertia_props do |props|
      profile = props[:profile]

      profile[:id] == @profile_user.id &&
        profile[:name] == @profile_user.name &&
        profile[:bio] == @profile_user.bio &&
        profile[:avatar_url] == @profile_user.avatar_url &&
        profile.keys.sort == %w[avatar_url bio id name]
    end
  end

  test "public profile includes earned active badges" do
    sign_in @viewer
    earned_badge = badges(:first_hike)
    user_badge = user_badges(:hiker_first_hike)

    get public_profile_url(@profile_user)

    assert_inertia_props do |props|
      badge = props[:badges].find { |item| item[:id] == earned_badge.id }

      badge[:name] == earned_badge.name &&
        badge[:slug] == earned_badge.slug &&
        badge[:description] == earned_badge.description &&
        badge[:earned_at] == user_badge.earned_at.iso8601
    end
  end

  test "public profile does not include inactive badges" do
    sign_in @viewer
    inactive_badge = badges(:inactive_destination)

    UserBadge.create!(
      user: @profile_user,
      badge: inactive_badge,
      earned_at: Time.current
    )

    get public_profile_url(@profile_user)

    assert_inertia_props do |props|
      props[:badges].none? { |badge| badge[:id] == inactive_badge.id }
    end
  end

  test "missing user returns not found" do
    sign_in @viewer

    get public_profile_url(User.maximum(:id) + 1)

    assert_response :not_found
  end
end
