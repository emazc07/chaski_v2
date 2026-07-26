class EventsController < InertiaController
  before_action :authenticate_user!, only: [ :mine, :new, :create, :edit, :update, :destroy ]
  before_action :require_admin!, only: [ :mine, :new, :create, :edit, :update, :destroy ]
  before_action :set_event, only: [ :show, :edit, :update, :destroy ]
  before_action -> { require_organizer!(@event) }, only: [ :edit, :update, :destroy ]

  def index
    render inertia: "events/index", props: {
      events: serialized_events(Event.published.order(starts_at: :asc).limit(6)),
      total_count: Event.published.count
    }
  end

  def all
    render inertia: "events/all", props: {
      events: serialized_events(Event.published.order(starts_at: :asc))
    }
  end

  def show
    unless @event.published? || @event.organizer_id == current_user&.id
      redirect_to events_path, alert: "Evento no disponible"
      return
    end

    inscription = current_user&.inscriptions&.find_by(event: @event)

    marked_ids =
      if inscription&.active?
        inscription.gear_item_marks.pluck(:gear_item_id)
      else
        []
      end

    render inertia: "events/show", props: {
      event: @event.as_json.merge(
        "gear_items" => @event.gear_items.ordered.as_json(
          only: [ :id, :name, :description, :required, :position ]
        )
      ),
      can_manage: current_user&.id == @event.organizer_id,
      inscription: inscription&.as_json(only: [ :id, :status ]),
      marked_gear_item_ids: marked_ids
    }
  end

  def mine
    render inertia: "events/mine", props: {
      events: current_user.organized_events.order(created_at: :desc)
    }
  end

  def new
    render inertia: "events/new"
  end

  def create
    event = current_user.organized_events.build(event_params)

    if event.save
      redirect_to events_mine_path
    else
      redirect_to events_new_path, inertia: { errors: event.errors }
    end
  end

  def edit
    render inertia: "events/edit", props: {
      event: @event.as_json(
        include: { gear_items: { only: [ :id, :name, :description, :required, :position ] } }
      )
    }
  end

  def update
    if @event.update(event_params)
      redirect_to events_mine_path
    else
      redirect_to "/events/#{@event.id}/edit", inertia: { errors: @event.errors }
    end
  end

  def destroy
    @event.destroy
    redirect_to events_mine_path
  end

  private

  def set_event
    @event = Event.find(params[:id])
  end

  def serialized_events(events)
    events.includes(:organizer).as_json(
      include: { organizer: { only: [ :id, :name ] } }
    )
  end

  def event_params
    params.require(:event).permit(
      :title,
      :description_short,
      :description_long,
      :custom_location,
      :difficulty,
      :distance_km,
      :elevation_gain_m,
      :duration_hours,
      :route_type,
      :starts_at,
      :meeting_point,
      :max_participants,
      :price_crc,
      gear_items_attributes: [ :id, :name, :description, :required, :position, :_destroy ]
    )
  end
end
