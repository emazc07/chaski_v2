import { Head, Link } from "@inertiajs/react"

import { Header } from "@/components/layout/Header"

type PublicProfile = {
  id: number
  name: string
  bio: string | null
  avatar_url: string | null
}

type PublicBadge = {
  id: number
  name: string
  slug: string
  description: string
  image_url: string
  earned_at: string
}

type PublicProfilePageProps = {
  profile: PublicProfile
  badges: PublicBadge[]
}

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function earnedDateLabel(value: string): string {
  return new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export default function PublicProfileShow({ profile, badges }: PublicProfilePageProps) {
  const initials = userInitials(profile.name)
  const bio = profile.bio?.trim()

  return (
    <div className="flex min-h-screen flex-col bg-chaski-bg">
      <Head title={`Perfil de ${profile.name}`} />
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-16">
          <nav aria-label="Navegación secundaria" className="text-sm text-stone-500">
            <Link href="/profile" className="hover:text-chaski-green">
              Mi cuenta
            </Link>
            <span className="mx-1.5" aria-hidden>
              ›
            </span>
            <span className="text-stone-700">Perfil público</span>
          </nav>

          <section className="mt-6 rounded-2xl border border-stone-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`Foto de perfil de ${profile.name}`}
                  className="h-32 w-32 shrink-0 rounded-full object-cover ring-4 ring-chaski-green/10 sm:h-36 sm:w-36"
                />
              ) : (
                <div
                  aria-hidden
                  className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-stone-200 text-3xl font-bold text-chaski-green-dark ring-4 ring-chaski-green/10 sm:h-36 sm:w-36"
                >
                  {initials}
                </div>
              )}

              <div className="min-w-0 flex-1 sm:pt-2">
                <p className="text-xs font-bold tracking-wider text-chaski-green uppercase">
                  Caminante Chaski
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                  {profile.name}
                </h1>

                {bio ? (
                  <p className="mt-4 max-w-2xl whitespace-pre-line text-base leading-7 text-stone-600">
                    {bio}
                  </p>
                ) : (
                  <p className="mt-4 text-sm italic text-stone-400">
                    Todavía no agregó una presentación.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="earned-badges-title">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="earned-badges-title"
                  className="text-2xl font-bold tracking-tight text-stone-900"
                >
                  Insignias obtenidas
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Logros que representan aventuras y desafíos completados.
                </p>
              </div>

              {badges.length > 0 && (
                <span className="rounded-full bg-chaski-green/10 px-3 py-1 text-xs font-bold text-chaski-green-dark">
                  {badges.length} {badges.length === 1 ? "insignia" : "insignias"}
                </span>
              )}
            </div>

            {badges.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                  <article
                    key={badge.id}
                    className="flex flex-col items-center rounded-xl border border-stone-200 bg-white px-5 py-6 text-center shadow-sm"
                  >
                    <div className="flex h-40 w-40 items-center justify-center">
                      <img
                        src={badge.image_url}
                        alt={`Insignia ${badge.name}`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-stone-900">{badge.name}</h3>

                    <p className="mt-2 flex-1 text-sm leading-5 text-stone-500">
                      {badge.description}
                    </p>

                    <p className="mt-4 text-xs font-semibold text-chaski-green">
                      Obtenida el {earnedDateLabel(badge.earned_at)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chaski-green/10 text-chaski-green">
                  <BadgeIcon />
                </div>
                <p className="mt-4 font-semibold text-stone-700">Todavía no tiene insignias</p>
                <p className="mt-2 text-sm text-stone-500">
                  Sus próximas aventuras aparecerán aquí.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function BadgeIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.5 14.4-1 6.1 4.5-2.2 4.5 2.2-1-6.1"
      />
    </svg>
  )
}
