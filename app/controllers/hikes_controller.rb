class HikesController < InertiaController
  before_action :authenticate_user!

  def mine
    inscriptions = current_user.inscriptions
      .joins(:event)
      .includes(event: { cover_image_attachment: :blob })
      .order("events.starts_at ASC")
    now = Time.current

    upcoming = []
    past = []
    cancelled = []

    inscriptions.each do |inscription|
      payload = serialize_inscription(inscription)

      if inscription.cancelled?
        cancelled << payload
      elsif inscription.event.starts_at >= now
        upcoming << payload
      else
        past << payload
      end
    end

    featured = Event.published.upcoming.with_attached_cover_image.order(starts_at: :asc).limit(3)

    render inertia: "hikes/mine", props: {
      upcoming: upcoming,
      past: past.reverse, # most recent past first
      cancelled: cancelled.reverse,
      next_hike: upcoming.first,
      featured_events: featured.map { |event| serialize_featured_event(event) }
    }
  end

  def all
    q = params[:q].to_s.strip.presence
    difficulty = params[:difficulty].presence_in(Event.difficulties.keys)
    zone = params[:zone].presence_in(Event::PROVINCE_LABELS.keys)
    date = params[:date].presence_in(%w[week month])

    inscriptions = current_user.inscriptions
      .joins(:event)
      .includes(event: { cover_image_attachment: :blob })
      .where.not(status: :cancelled)
      .merge(
        Event.search(q)
          .by_difficulty(difficulty)
          .by_zone(zone)
          .by_date(date)
      )
      .order("events.starts_at ASC")

    now = Time.current
    upcoming = []
    past = []

    inscriptions.each do |inscription|
      payload = serialize_inscription(inscription)

      if inscription.event.starts_at >= now
        upcoming << payload
      else
        past << payload
      end
    end

    render inertia: "hikes/all", props: {
      upcoming: upcoming,
      past: past.reverse,
      q: q,
      difficulty: difficulty,
      zone: zone,
      date: date,
      total_count: upcoming.size + past.size
    }
  end

  private

  def serialize_inscription(inscription)
    event = inscription.event
    {
      id: inscription.id,
      status: inscription.status,
      event: event.as_json(
        only: [ :id, :title, :slug, :custom_location, :description_short, :difficulty, :starts_at, :status ]
      ).merge(cover_image_urls(event))
    }
  end

  def serialize_featured_event(event)
    event.as_json(
      only: [ :id, :title, :custom_location, :description_short, :difficulty, :starts_at ]
    ).merge(cover_image_urls(event))
  end

  def cover_image_urls(event)
    {
      "cover_image_card_url" => event.cover_image_card_url,
      "cover_image_hero_url" => event.cover_image_hero_url
    }
  end
end
