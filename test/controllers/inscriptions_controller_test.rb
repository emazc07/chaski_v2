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
end
