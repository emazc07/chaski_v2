import { difficultyFormLabel } from "@/lib/difficulty"
import { formatEventDateHero } from "@/lib/dates"
import { statusBadgeClasses, statusLabels } from "@/lib/eventLabels"

type EventHeroProps = {
  title: string
  difficulty: string
  startsAt: string
  location: string
  coverImageUrl?: string | null
  status?: string
  showStatusBadge?: boolean
}

export function EventHero({
  title,
  difficulty,
  startsAt,
  location,
  coverImageUrl,
  status,
  showStatusBadge = false,
}: EventHeroProps) {
  const difficultyLabel = difficultyFormLabel(difficulty)
  const statusLabel = status ? (statusLabels[status] ?? status) : null

  return (
    <section className="relative min-h-[360px] w-full overflow-hidden sm:min-h-[440px] lg:min-h-[520px]">
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-chaski-green/40 via-chaski-heading/60 to-stone-800"
        />
      )}

      {/* Bottom vignette keeps meta readable near the base */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />
      {/* Left scrim: title always sits on a dark plane regardless of cover mid-tones */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent sm:via-black/35 lg:w-[70%]"
      />

      <div className="relative mx-auto flex h-full min-h-[360px] max-w-6xl flex-col justify-end px-6 py-10 sm:min-h-[440px] sm:py-12 lg:min-h-[520px] lg:px-8 lg:pb-14">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-md bg-chaski-green px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {difficultyLabel}
          </span>
          {showStatusBadge && status && statusLabel && (
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusBadgeClasses[status] ?? "border-amber-200 bg-amber-50 text-amber-800"}`}
            >
              {statusLabel}
            </span>
          )}
        </div>

        <h1 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        <div className="mt-4 flex flex-col gap-2 text-sm text-white/95 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
          <p className="flex items-center gap-2">
            <CalendarIcon />
            <span className="capitalize">{formatEventDateHero(startsAt)}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPinIcon />
            <span>{location}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 shrink-0 text-amber-200"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
      />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 shrink-0 text-amber-200"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  )
}
