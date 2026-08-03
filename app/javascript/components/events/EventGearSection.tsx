import { Link } from "@inertiajs/react"

import type { GearItem } from "@/types"

type EventGearSectionProps = {
  items: GearItem[]
  markedIds: number[]
  canMark: boolean
  markUrl: (item: GearItem) => string
  hint?: string
}

export function EventGearSection({
  items,
  markedIds,
  canMark,
  markUrl,
  hint,
}: EventGearSectionProps) {
  if (items.length === 0) return null

  const markedSet = new Set(markedIds)

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-chaski-heading">Equipo necesario</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
          <InfoIcon />
          Llevar ropa adecuada
        </span>
      </div>

      {hint && <p className="mt-2 text-sm text-stone-500">{hint}</p>}

      <ul className="mt-4 grid grid-cols-1 gap-x-8 rounded-xl bg-stone-100/90 px-4 py-1 sm:grid-cols-2">
        {items.map((item) => {
          const marked = markedSet.has(item.id)

          return (
            <li
              key={item.id}
              className="flex items-start gap-3 border-b border-stone-200/80 py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              {canMark ? (
                <Link
                  href={markUrl(item)}
                  method={marked ? "delete" : "post"}
                  as="button"
                  preserveScroll
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                    marked
                      ? "border-chaski-green bg-chaski-green text-white"
                      : "border-violet-300 bg-white text-violet-500"
                  }`}
                  aria-label={marked ? `Desmarcar ${item.name}` : `Marcar ${item.name}`}
                >
                  ✓
                </Link>
              ) : (
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-violet-200 bg-white text-xs text-violet-500"
                >
                  ✓
                </span>
              )}

              <div className="min-w-0">
                <p
                  className={`text-sm font-medium ${
                    marked ? "text-stone-400 line-through" : "text-stone-800"
                  }`}
                >
                  {item.name}
                  {item.required && (
                    <span className="ml-2 text-xs font-normal text-stone-500">(requerido)</span>
                  )}
                </p>
                {item.description && (
                  <p className="mt-0.5 text-sm text-stone-500">{item.description}</p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function InfoIcon() {
  return (
    <svg
      aria-hidden
      className="h-3.5 w-3.5 text-stone-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      />
    </svg>
  )
}
