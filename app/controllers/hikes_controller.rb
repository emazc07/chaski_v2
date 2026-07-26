class HikesController < InertiaController
  before_action :authenticate_user!

  def mine
    inscriptions = current_user.inscriptions.joins(:event).includes(:event).order("events.starts_at ASC")
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

    render inertia: "hikes/mine", props: {
      upcoming: upcoming,
      past: past.reverse,       # most recent past first
      cancelled: cancelled.reverse,
      next_hike: upcoming.first,
      featured_events: Event.published.order(starts_at: :asc).limit(3),
    }
  end

  private

  def serialize_inscription(inscription)
    {
      id: inscription.id,
      status: inscription.status,
      event: inscription.event.as_json(
        only: [:id, :title, :slug, :custom_location, :description_short, :difficulty, :starts_at, :status]
      ),
    }
  end
end
