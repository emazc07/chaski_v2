class BadgesController < InertiaController
  before_action :authenticate_user!

  def index
    badges = Badge.active.order(:position).to_a

    user_badges_by_badge_id = current_user.user_badges
      .where(badge_id: badges.map(&:id))
      .index_by(&:badge_id)

    render inertia: "badges/index", props: {
      badges: badges.map do |badge|
          user_badge = user_badges_by_badge_id[badge.id]
        {
          id: badge.id,
          name: badge.name,
          slug: badge.slug,
          description: badge.description,
          icon: badge.icon,
          image_url: view_context.asset_path("badges/#{badge.icon}.png"),
          category: badge.category,
          position: badge.position,
          earned: user_badge.present?,
          earned_at: user_badge&.earned_at&.iso8601
        }
      end
    }
  end
end
