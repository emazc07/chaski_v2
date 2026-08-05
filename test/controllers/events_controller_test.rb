require "test_helper"

class EventsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @event = events(:published_hike)
    @organizer = users(:organizer)
    @hiker = users(:hiker)
  end

  test "show includes confirmation code for organizer" do
    sign_in @organizer
    get "/events/#{@event.id}"
    assert_response :success
  end

  test "regenerate confirmation code" do
    sign_in @organizer
    original = @event.confirmation_code

    patch "/events/#{@event.id}/regenerate_confirmation_code"

    assert_redirected_to "/events/#{@event.id}"
    assert_not_equal original, @event.reload.confirmation_code
  end

  test "create redirects to profile when whatsapp missing" do
    sign_in @organizer
    @organizer.update!(whatsapp_phone: nil)

    post "/events", params: {
      event: {
        title: "Nueva",
        description_short: "Corta",
        description_long: "Larga descripción de prueba",
        custom_location: "Cartago",
        difficulty: "easy",
        distance_km: 5,
        elevation_gain_m: 100,
        duration_hours: 2,
        route_type: "loop",
        starts_at: 1.week.from_now,
        meeting_point: "Entrada",
        max_participants: 10,
        price_crc: 0
      }
    }

    assert_redirected_to "/profile/edit"
  end

  test "non organizer cannot regenerate code" do
    sign_in @hiker
    patch "/events/#{@event.id}/regenerate_confirmation_code"
    assert_response :redirect
  end
end
