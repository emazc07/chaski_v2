# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

badges = [
  {
    name: "Primera caminata",
    slug: "primera-caminata",
    description: "Completaste tu primera aventura con Chaski.",
    icon: "first_hike",
    category: "onboarding",
    rule_key: "first_completed_hike",
    position: 1,
    active: true
  },
  {
    name: "10 caminatas",
    slug: "10-caminatas",
    description: "Alcanzaste diez caminatas completadas.",
    icon: "ten_hikes",
    category: "milestone",
    rule_key: "ten_completed_hikes",
    position: 2,
    active: true
  },
  {
    name: "50 caminatas",
    slug: "50-caminatas",
    description: "Llegaste a cincuenta aventuras completadas.",
    icon: "fifty_hikes",
    category: "milestone",
    rule_key: "fifty_completed_hikes",
    position: 3,
    active: true
  },
  {
    name: "Héroe de los volcanes",
    slug: "heroe-de-los-volcanes",
    description: "Conquistaste las principales rutas volcánicas.",
    icon: "volcano_hero",
    category: "destination",
    rule_key: "volcano_routes_completed",
    position: 4,
    active: true
  },
  {
    name: "Héroe del Chirripó",
    slug: "heroe-del-chirripo",
    description: "Completaste la aventura hacia la cima del Chirripó.",
    icon: "chirripo_hero",
    category: "destination",
    rule_key: "chirripo_completed",
    position: 5,
    active: true
  },
  {
    name: "Caminata difícil",
    slug: "caminata-dificil",
    description: "Completaste una ruta de dificultad alta.",
    icon: "hard_hike",
    category: "special",
    rule_key: "hard_hike_completed",
    position: 6,
    active: true
  },
  {
    name: "Caminata extrema",
    slug: "caminata-extrema",
    description: "Superaste una de las rutas más exigentes de Chaski.",
    icon: "extreme_hike",
    category: "special",
    rule_key: "extreme_hike_completed",
    position: 7,
    active: true
  }
]

badges.each do |attributes|
  badge = Badge.find_or_initialize_by(slug: attributes[:slug])
  badge.assign_attributes(attributes.except(:slug))
  badge.save!
end

if Rails.env.development?
  demo_user = User.find_or_initialize_by(email: "demo@chaski.test")
  demo_user.assign_attributes(
    name: "Caminante Demo",
    password: "password123",
    password_confirmation: "password123",
    admin: false
  )
  demo_user.save!

  Badge.active.order(:position).each_with_index do |badge, index|
    user_badge = demo_user.user_badges.find_or_initialize_by(badge: badge)
    user_badge.earned_at ||= (7 - index).weeks.ago
    user_badge.save!
  end
end
