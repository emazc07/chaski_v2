import { Head, Link, router, usePage } from "@inertiajs/react"
import { useRef, useState, type ChangeEvent, type ReactNode } from "react"

import { Header } from "@/components/layout/Header"

import type { SharedProps } from "@/types"

type AccountCard = {
  title: string
  description: string
  href?: string
  disabled?: boolean
  icon: ReactNode
}

type ProfilePageProps = SharedProps & {
  errors?: {
    avatar?: string | string[]
  }
}

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function avatarErrorMessage(error: string | string[] | undefined): string | null {
  if (!error) return null
  return Array.isArray(error) ? (error[0] ?? null) : error
}

function AccountLinkCard({ title, description, href, disabled, icon }: AccountCard) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chaski-green/10 text-chaski-green">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-stone-900">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-stone-500">
          {disabled ? "Próximamente" : description}
        </span>
      </span>
      <ChevronIcon />
    </>
  )

  const className =
    "flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition"

  if (disabled || !href) {
    return (
      <div aria-disabled className={`${className} cursor-not-allowed opacity-60`}>
        {content}
      </div>
    )
  }

  return (
    <Link href={href} className={`${className} hover:border-chaski-green/40 hover:shadow-md`}>
      {content}
    </Link>
  )
}

export default function ProfilesShow() {
  const { auth, errors } = usePage<ProfilePageProps>().props
  const user = auth?.user
  const fullName = user?.name ?? "caminante"
  const firstName = fullName.split(" ")[0] ?? "caminante"
  const initials = userInitials(fullName)
  const avatarUrl = user?.avatar_url
  const avatarError = avatarErrorMessage(errors?.avatar)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  function openFilePicker() {
    if (uploading) return
    fileInputRef.current?.click()
  }

  function handleAvatarSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    router.patch(
      "/profile/avatar",
      { avatar: file },
      {
        forceFormData: true,
        onFinish: () => {
          setUploading(false)
          if (fileInputRef.current) fileInputRef.current.value = ""
        },
      },
    )
  }

  const cards: AccountCard[] = [
    {
      title: "Ver perfil",
      description: "Mirá cómo otras personas ven tu perfil público.",
      disabled: true,
      icon: <PersonIcon />,
    },
    {
      title: "Información personal",
      description: "Actualizá tu nombre, biografía, ubicación y foto de perfil.",
      disabled: true,
      icon: <GearIcon />,
    },
    {
      title: "Mis caminatas",
      description: "Consultá las caminatas en las que estás inscrito.",
      href: "/hikes/mine",
      icon: <MapIcon />,
    },
    {
      title: "Mis insignias",
      description: "Revisá los logros e insignias que ganaste en Chaski.",
      disabled: true,
      icon: <BadgeIcon />,
    },
    ...(user?.admin
      ? [
          {
            title: "Mis eventos",
            description: "Administrá los eventos que organizaste o publicaste.",
            href: "/events/mine",
            icon: <CalendarIcon />,
          } satisfies AccountCard,
        ]
      : []),
  ]

  return (
    <div className="flex min-h-screen flex-col bg-chaski-bg">
      <Header />
      <main className="flex-1">
        <Head title="Tu cuenta" />

        <div className="mx-auto max-w-5xl px-6 pt-8 pb-12">
          <section className="mb-10 flex flex-col items-start justify-between gap-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="text-base text-stone-600">Hola,</p>
              <h1 className="mt-1 text-4xl font-bold tracking-tight text-chaski-green sm:text-5xl">
                {firstName}
              </h1>
              <p className="mt-3 max-w-md text-sm text-stone-500">
                Administrá tu perfil y tu actividad en Chaski.
              </p>
            </div>

            <div className="flex flex-col items-center self-center sm:self-auto">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`Foto de perfil de ${fullName}`}
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-white"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-stone-200 text-2xl font-bold text-chaski-green-dark ring-4 ring-white"
                  >
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={uploading}
                  aria-label="Cambiar foto de perfil"
                  className="absolute right-0 bottom-0 flex h-9 w-9 items-center justify-center rounded-full bg-chaski-green text-white shadow-md ring-2 ring-white disabled:opacity-60"
                >
                  <CameraIcon />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleAvatarSelected}
              />
              <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                className="mt-3 text-sm font-semibold text-chaski-green disabled:opacity-60"
              >
                {uploading ? "Subiendo…" : "Cambiar foto"}
              </button>
              {avatarError ? (
                <p className="mt-2 max-w-[12rem] text-center text-xs text-red-600" role="alert">
                  {avatarError}
                </p>
              ) : (
                <p className="mt-2 text-center text-xs text-stone-400">
                  JPEG, PNG o WebP · máx. 5 MB
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl font-bold text-stone-900">Tu cuenta</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <li key={card.title}>
                  <AccountLinkCard {...card} />
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 flex justify-center">
            <Link
              href="/users/sign_out"
              method="delete"
              as="button"
              className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-stone-200/80 px-6 py-3.5 text-sm font-bold text-stone-800 hover:bg-stone-300/80"
            >
              <LogoutIcon />
              Cerrar sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden
      className="mt-1 h-4 w-4 shrink-0 text-stone-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.496c.317.158.69.158 1.006 0Z"
      />
    </svg>
  )
}

function BadgeIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 12.75 9.75h-1.5A3.375 3.375 0 0 0 7.5 14.25v4.5m9-14.25h.008v.008H16.5V4.5Zm-9 0h.008v.008H7.5V4.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.75a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
      />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.055-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
      />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
      />
    </svg>
  )
}
