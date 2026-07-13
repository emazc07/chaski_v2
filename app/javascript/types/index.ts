export type FlashData = {
  notice?: string
  alert?: string
}

export type Event = {
  id: number
  title: string
  slug: string
  description_short: string
  description_long: string
  custom_location: string
  difficulty: string
  distance_km: string
  elevation_gain_m: number
  duration_hours: string
  route_type: string
  starts_at: string
  meeting_point: string
  max_participants: number
  price_crc: number
  status: string
  organizer_id: number
  created_at: string
  updated_at: string
}

export type AuthUser = {
  id: number
  name: string
  email: string
  admin: boolean
}

export type SharedProps = {
  auth?: {
    user: AuthUser | null
  }
}