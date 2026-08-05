class EventsController < InertiaController
  before_action :authenticate_user!, only: [ :mine, :new, :create, :edit, :update, :destroy, :regenerate_confirmation_code ]
  before_action :require_admin!, only: [ :mine, :new, :create, :edit, :update, :destroy, :regenerate_confirmation_code ]
  before_action :set_event, only: [ :show, :edit, :update, :destroy, :regenerate_confirmation_code ]
  before_action -> { require_organizer!(@event) }, only: [ :edit, :update, :destroy, :regenerate_confirmation_code ]

  def index
    render inertia: "events/index", props: {
      events: serialized_events(
        Event.published.with_attached_cover_image.order(starts_at: :asc).limit(6)
      ),
      total_count: Event.published.count
    }
  end

  def all
    q = params[:q].to_s.strip.presence
    difficulty = params[:difficulty].presence_in(Event.difficulties.keys)
    zone = params[:zone].presence_in(Event::PROVINCE_LABELS.keys)
    date = params[:date].presence_in(%w[week month])

    events = Event.published
      .with_attached_cover_image
      .search(q)
      .by_difficulty(difficulty)
      .by_zone(zone)
      .by_date(date)
      .order(starts_at: :asc)

    render inertia: "events/all", props: {
      events: serialized_events(events),
      q: q,
      difficulty: difficulty,
      zone: zone,
      date: date,
      total_count: events.size
    }
  end

  def show
    unless @event.published? || @event.organizer_id == current_user&.id
      redirect_to events_path, alert: "Evento no disponible"
      return
    end

    can_manage = current_user&.id == @event.organizer_id
    inscription = current_user&.inscriptions&.find_by(event: @event)

    marked_ids =
      if inscription&.active?
        inscription.gear_item_marks.pluck(:gear_item_id)
      else
        []
      end

    event_json = @event.as_json(include: { organizer: { only: [ :id, :name ] } })
    event_json["organizer"] = (event_json["organizer"] || {}).merge(
      "avatar_url" => @event.organizer&.avatar_url,
      "has_whatsapp" => @event.organizer&.whatsapp_phone_present?
    )
    event_json.merge!(cover_image_urls(@event)).merge!(
      "gear_items" => @event.gear_items.ordered.as_json(
        only: [ :id, :name, :description, :required, :position ]
      )
    )

    render inertia: "events/show", props: {
      event: event_json,
      can_manage: can_manage,
      inscription: inscription&.as_json(only: [ :id, :status ]),
      marked_gear_item_ids: marked_ids,
      whatsapp_url: whatsapp_url_for(@event),
      confirmation_code: can_manage ? @event.confirmation_code : nil
    }
  end

  def mine
    render inertia: "events/mine", props: {
      events: serialized_events(
        current_user.organized_events.with_attached_cover_image.order(created_at: :desc)
      )
    }
  end

  def new
    render inertia: "events/new"
  end

  def create
    unless current_user.whatsapp_phone_present?
      redirect_to "/profile/edit", alert: "Agregá tu WhatsApp en el perfil antes de crear una caminata"
      return
    end

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
      ).merge(cover_image_urls(@event)).merge(
        "confirmation_code" => @event.confirmation_code
      )
    }
  end

  def update
    unless current_user.whatsapp_phone_present?
      redirect_to "/profile/edit", alert: "Agregá tu WhatsApp en el perfil antes de editar una caminata"
      return
    end

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

  def regenerate_confirmation_code
    @event.regenerate_confirmation_code!
    redirect_to "/events/#{@event.id}", notice: "Código de confirmación regenerado"
  end

  private

  def whatsapp_url_for(event)
    phone = event.organizer&.whatsapp_phone
    return nil if phone.blank? || current_user.blank?

    text = ::WhatsappUrl.inscription_message(
      hiker_name: current_user.name,
      event_title: event.title,
      event_url: "#{request.base_url}/events/#{event.id}"
    )
    ::WhatsappUrl.build(phone: phone, text: text)
  end

  def set_event
    @event = Event.with_attached_cover_image
      .includes(organizer: { avatar_attachment: :blob })
      .find(params[:id])
  end

  def serialized_events(events)
    events.includes(organizer: { avatar_attachment: :blob }).map do |event|
      json = event.as_json(include: { organizer: { only: [ :id, :name ] } })
      json["organizer"] = (json["organizer"] || {}).merge(
        "avatar_url" => event.organizer&.avatar_url
      )
      json.merge(cover_image_urls(event))
    end
  end

  def cover_image_urls(event)
    {
      "cover_image_card_url" => event.cover_image_card_url,
      "cover_image_hero_url" => event.cover_image_hero_url
    }
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
      :cover_image,
      gear_items_attributes: [ :id, :name, :description, :required, :position, :_destroy ]
    )
  end
end
