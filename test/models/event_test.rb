require "test_helper"

class EventTest < ActiveSupport::TestCase
  setup do
    @organizer = users(:organizer)
  end

  test "generates confirmation code on create" do
    event = @organizer.organized_events.build(
      title: "Volcán Poás",
      description_short: "Caminata corta al cráter",
      description_long: "Descripción larga de la caminata.",
      custom_location: "Alajuela",
      difficulty: :easy,
      distance_km: 4,
      elevation_gain_m: 200,
      duration_hours: 3,
      route_type: :loop,
      starts_at: 1.week.from_now,
      meeting_point: "Entrada del parque",
      max_participants: 10,
      price_crc: 0,
      status: :published
    )

    assert event.save, event.errors.full_messages.join(", ")
    assert_equal 6, event.confirmation_code.length
    assert_match(/\A[A-HJ-NP-Z2-9]{6}\z/, event.confirmation_code)
  end

  test "requires organizer whatsapp phone" do
    @organizer.update!(whatsapp_phone: nil)
    event = @organizer.organized_events.build(
      title: "Sin WhatsApp",
      description_short: "Corta",
      description_long: "Larga descripción",
      custom_location: "Heredia",
      difficulty: :easy,
      distance_km: 3,
      elevation_gain_m: 100,
      duration_hours: 2,
      route_type: :loop,
      starts_at: 1.week.from_now,
      meeting_point: "Parqueo",
      max_participants: 8,
      status: :published
    )

    assert_not event.valid?
    assert_includes event.errors[:base], "Agregá tu WhatsApp en el perfil antes de crear o editar una caminata"
  end

  test "confirmation_code_matches? normalizes input" do
    event = events(:published_hike)
    assert event.confirmation_code_matches?(" abc234 ")
    assert_not event.confirmation_code_matches?("ZZZZZZ")
  end

  test "regenerate_confirmation_code! changes code" do
    event = events(:published_hike)
    original = event.confirmation_code
    event.regenerate_confirmation_code!
    assert_not_equal original, event.confirmation_code
  end

  test "upcoming and past scopes split by starts_at" do
    upcoming = events(:published_hike)
    past = events(:past_hike)

    assert_includes Event.upcoming, upcoming
    assert_not_includes Event.upcoming, past
    assert_includes Event.past, past
    assert_not_includes Event.past, upcoming
  end

  test "past? and upcoming? reflect starts_at" do
    assert events(:past_hike).past?
    assert_not events(:past_hike).upcoming?
    assert events(:published_hike).upcoming?
    assert_not events(:published_hike).past?
  end

  test "destroying event nullifies user badge event reference" do
    event = events(:published_hike)
    user_badge = user_badges(:hiker_first_hike)

    assert_difference "Event.count", -1 do
      assert_no_difference "UserBadge.count" do
        event.destroy!
      end
    end

    assert_nil user_badge.reload.event_id
  end
end
