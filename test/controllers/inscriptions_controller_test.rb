require "test_helper"

class InscriptionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @event = events(:published_hike)
    @hiker = users(:hiker)
    @organizer = users(:organizer)
  end

  test "create starts inscription as pending" do
    sign_in @hiker

    assert_difference -> { Inscription.count }, 1 do
      post "/events/#{@event.id}/inscription"
    end

    inscription = @hiker.inscriptions.find_by!(event: @event)
    assert inscription.pending?
    assert_redirected_to "/events/#{@event.id}"
    assert_match(/WhatsApp/, flash[:notice])
  end

  test "confirm activates pending inscription with valid code" do
    sign_in @hiker
    inscription = @hiker.inscriptions.create!(event: @event, status: :pending)

    post "/events/#{@event.id}/inscription/confirm", params: { code: @event.confirmation_code }

    assert_redirected_to "/events/#{@event.id}"
    assert_equal "Te inscribiste en la caminata", flash[:notice]
    inscription.reload
    assert inscription.active?
    assert_not_nil inscription.confirmed_at
  end

  test "confirm rejects invalid code" do
    sign_in @hiker
    inscription = @hiker.inscriptions.create!(event: @event, status: :pending)

    post "/events/#{@event.id}/inscription/confirm", params: { code: "WRONG1" }

    assert_redirected_to "/events/#{@event.id}"
    assert_match(/incorrecto/i, flash[:alert])
    assert inscription.reload.pending?
  end

  test "destroy cancels pending inscription" do
    sign_in @hiker
    inscription = @hiker.inscriptions.create!(event: @event, status: :pending)

    delete "/events/#{@event.id}/inscription"

    assert inscription.reload.cancelled?
  end

  test "organizer can cancel a hiker inscription" do
    sign_in @organizer
    inscription = @hiker.inscriptions.create!(event: @event, status: :active, confirmed_at: Time.current)

    delete "/events/#{@event.id}/inscriptions/#{inscription.id}"

    assert_redirected_to events_mine_path
    assert_equal "Quitaste al caminante de la lista", flash[:notice]
    assert inscription.reload.cancelled?
    assert_not_nil inscription.cancelled_at
  end

  test "non organizer cannot cancel another hikers inscription" do
    sign_in @hiker
    other = @hiker.inscriptions.create!(event: @event, status: :pending)

    delete "/events/#{@event.id}/inscriptions/#{other.id}"

    assert_response :redirect
    assert other.reload.pending?
  end

  test "organizer cannot cancel inscription on past event" do
    sign_in @organizer
    @event.update!(starts_at: 1.week.ago)
    inscription = @hiker.inscriptions.create!(event: @event, status: :active, confirmed_at: 1.week.ago)

    delete "/events/#{@event.id}/inscriptions/#{inscription.id}"

    assert_redirected_to events_mine_path
    assert_match(/ya pasó/i, flash[:alert])
    assert inscription.reload.active?
  end
end
