class GearItemMarksController < InertiaController
  before_action :authenticate_user!
  before_action :set_event
  before_action :set_inscription
  before_action :set_gear_item

  def create
    @inscription.gear_item_marks.find_or_create_by(gear_item: @gear_item)
    redirect_to "/events/#{@event.id}"
  end

  def destroy
    @inscription.gear_item_marks.find_by(gear_item: @gear_item)&.destroy
    redirect_to "/events/#{@event.id}"
  end

  private

  def set_event
    @event = Event.published.find(params[:event_id])
  end

  def set_inscription
    @inscription = current_user.inscriptions.find_by(event: @event, status: :active)
    redirect_to "/events/#{@event.id}", alert: "Debes estar inscrito para marcar tu equipo" unless @inscription
  end

  def set_gear_item
    @gear_item = @event.gear_items.find(params[:gear_item_id])
  end
end
