export type FlashData = {
  notice?: string
  alert?: string
}

export type AuthUser = {
  id: number
  name: string
  email: string
  admin: boolean
  avatar_url?: string | null
}

export type Inscription = {
  id: number
  status: string
}

export type GearItem = {
  id: number
  name: string
  description: string | null
  required: boolean
  position: number
}

export type GearItemFormRow = {
  id?: number
  name: string
  description?: string
  required?: boolean
  position?: number
  _destroy?: boolean
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
  avatar_url?: string | null
}

export type EventListItem = Pick<
  Event,
  "id" | "title" | "custom_location" | "difficulty" | "starts_at" | "cover_image_card_url"
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
  gear_items?: GearItem[]
  created_at: string
  updated_at: string
  cover_image_card_url?: string | null
  cover_image_hero_url?: string | null
}

export type SharedProps = {
  auth?: {
    user: AuthUser | null
  }
}
