class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  def require_admin!
    redirect_to events_path, alert: "No autorizado" unless current_user&.admin?
  end

  def require_organizer!(event)
    redirect_to events_mine_path, alert: "No autorizado" unless event.organizer_id == current_user&.id
  end
end