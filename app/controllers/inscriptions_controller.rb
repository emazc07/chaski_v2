class InscriptionsController < InertiaController
  before_action :authenticate_user!
  before_action :set_event

  def create
    inscription = current_user.inscriptions.find_or_initialize_by(event: @event)
    inscription.assign_attributes(status: :active, cancelled_at: nil, cancellation_reason: nil)

    if inscription.save
      redirect_to "/events/#{@event.id}", notice: "Te inscribiste en la caminata"
    else
      redirect_to "/events/#{@event.id}", inertia: { errors: inscription.errors }
    end
  end

  def destroy
    inscription = current_user.inscriptions.find_by(event: @event)
    inscription&.update(status: :cancelled, cancelled_at: Time.current)

    redirect_to "/events/#{@event.id}", notice: "Cancelaste tu inscripción"
  end

  private

  def set_event
    @event = Event.published.find(params[:event_id])
  end
end