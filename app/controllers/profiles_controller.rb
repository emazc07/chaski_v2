class ProfilesController < InertiaController
  before_action :authenticate_user!

  def show
    render inertia: "profiles/show"
  end

  def public_show
    profile_user = User.find(params[:id])

    earned_badges = profile_user.user_badges
      .joins(:badge)
      .merge(Badge.active)
      .includes(:badge)
      .order("badges.position ASC")

    render inertia: "profiles/public_show", props: {
      profile: {
        id: profile_user.id,
        name: profile_user.name,
        bio: profile_user.bio,
        avatar_url: profile_user.avatar_url
      },
      badges: earned_badges.map do |user_badge|
        badge = user_badge.badge

        {
          id: badge.id,
          name: badge.name,
          slug: badge.slug,
          description: badge.description,
          image_url: view_context.asset_path("badges/#{badge.icon}.png"),
          earned_at: user_badge.earned_at.iso8601
        }
      end
    }
  end

  def edit
    render inertia: "profiles/edit", props: {
      profile: profile_props
    }
  end

  def update
    if current_user.update(profile_params)
      redirect_to "/profile/edit"
    else
      redirect_to "/profile/edit", inertia: { errors: current_user.errors }
    end
  end

  def update_avatar
    if current_user.update(avatar: params.require(:avatar))
      redirect_to "/profile"
    else
      redirect_to "/profile", inertia: { errors: current_user.errors }
    end
  end

  private

  def profile_props
    {
      name: current_user.name,
      bio: current_user.bio,
      location: current_user.location,
      birthday: current_user.birthday&.iso8601,
      experience_level: current_user.experience_level,
      whatsapp_phone: current_user.whatsapp_phone
    }
  end

  def profile_params
    permitted = params.permit(:name, :bio, :location, :birthday, :experience_level, :whatsapp_phone)
    if permitted.key?(:experience_level) && permitted[:experience_level].blank?
      permitted[:experience_level] = nil
    end
    if permitted.key?(:birthday) && permitted[:birthday].blank?
      permitted[:birthday] = nil
    end
    if permitted.key?(:whatsapp_phone) && permitted[:whatsapp_phone].blank?
      permitted[:whatsapp_phone] = nil
    end
    permitted
  end
end
