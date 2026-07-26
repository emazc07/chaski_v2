export type FlashData = {
  notice?: string
  alert?: string
}

export type AuthUser = {
  id: number
  name: string
  email: string
  admin: boolean
}

export type Inscription = {
  id: number
  status: string
}

export type HikeInscription = {
  id: number
  status: string
  event: Pick<
    Event,
    | "id"
    | "title"
    | "slug"
    | "custom_location"
    | "description_short"
    | "difficulty"
    | "starts_at"
    | "status"
  >
}

export type EventOrganizer = {
  id: number
  name: string
}

export type EventListItem = Pick<
  Event,
  "id" | "title" | "custom_location" | "difficulty" | "starts_at"
> & {
  organizer: EventOrganizer
}

export type FeaturedEvent = Pick<
  Event,
  "id" | "title" | "custom_location" | "description_short" | "difficulty" | "starts_at"
>

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

export type SharedProps = {
  auth?: {
    user: AuthUser | null
  }
}
