class ProfilesController < InertiaController
  before_action :authenticate_user!

  def show
    render inertia: "profiles/show"
  end

  def update_avatar
    if current_user.update(avatar: params.require(:avatar))
      redirect_to "/profile"
    else
      redirect_to "/profile", inertia: { errors: current_user.errors }
    end
  end
end
