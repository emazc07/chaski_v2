export type FlashData = {
  notice?: string
  alert?: string
}

export type AuthUser = {
  id: number
  name: string
  email: string
}

export type SharedProps = {
  auth?: {
    user: AuthUser | null
  }
}