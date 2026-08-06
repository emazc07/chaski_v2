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
    | "cover_image_card_url"
    | "cover_image_hero_url"
  >
}

export type EventOrganizer = {
  id: number
  name: string
  avatar_url?: string | null
  has_whatsapp?: boolean
}

export type EventListItem = Pick<
  Event,
  "id" | "title" | "custom_location" | "difficulty" | "starts_at" | "cover_image_card_url"
> & {
  organizer: EventOrganizer
}

export type FeaturedEvent = Pick<
  Event,
  | "id"
  | "title"
  | "custom_location"
  | "description_short"
  | "difficulty"
  | "starts_at"
  | "cover_image_card_url"
  | "cover_image_hero_url"
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
  organizer?: EventOrganizer
  gear_items?: GearItem[]
  confirmation_code?: string | null
  created_at: string
  updated_at: string
  cover_image_card_url?: string | null
  cover_image_hero_url?: string | null
}

export type OrganizerInscriptionHiker = {
  id: number
  name: string
  avatar_url?: string | null
}

export type OrganizerInscription = {
  id: number
  status: string
  confirmed_at?: string | null
  user: OrganizerInscriptionHiker
}

export type OrganizerEvent = Pick<
  Event,
  | "id"
  | "title"
  | "slug"
  | "custom_location"
  | "description_short"
  | "difficulty"
  | "starts_at"
  | "status"
  | "cover_image_card_url"
  | "cover_image_hero_url"
> & {
  confirmed_count: number
  pending_count: number
  inscriptions: OrganizerInscription[]
}

export type SharedProps = {
  auth?: {
    user: AuthUser | null
  }
  flash?: FlashData
}
