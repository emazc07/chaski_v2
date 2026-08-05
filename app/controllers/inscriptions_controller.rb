class InscriptionsController < InertiaController
  before_action :authenticate_user!
  before_action :set_event

  def create
    inscription = current_user.inscriptions.find_or_initialize_by(event: @event)
    inscription.assign_attributes(
      status: :pending,
      cancelled_at: nil,
      cancellation_reason: nil,
      confirmed_at: nil
    )

    if inscription.save
      redirect_to "/events/#{@event.id}", notice: "Solicitaste cupo. Contactá al organizador por WhatsApp y confirmá con el código."
    else
      redirect_to "/events/#{@event.id}", inertia: { errors: inscription.errors }
    end
  end

  def confirm
    inscription = current_user.inscriptions.find_by(event: @event)

    unless inscription&.pending?
      redirect_to "/events/#{@event.id}", alert: "No tenés una solicitud pendiente para confirmar"
      return
    end

    unless @event.confirmation_code_matches?(params[:code])
      redirect_to "/events/#{@event.id}", alert: "El código ingresado es incorrecto. Pedile el correcto al organizador por WhatsApp."
      return
    end

    inscription.confirm!
    redirect_to "/events/#{@event.id}", notice: "Te inscribiste en la caminata"
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
