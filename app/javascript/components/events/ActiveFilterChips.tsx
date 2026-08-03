import { router } from "@inertiajs/react"

import { DIFFICULTY_FORM_LABELS } from "@/lib/difficulty"

import { PROVINCE_OPTIONS } from "./EventsFilterBar"

const DATE_LABELS: Record<string, string> = {
  week: "Esta semana",
  month: "Este mes",
}

type FilterKey = "q" | "difficulty" | "zone" | "date"

type ActiveFilterChipsProps = {
  q?: string | null
  difficulty?: string | null
  zone?: string | null
  date?: string | null
  path?: string
  only?: string[]
}

const DEFAULT_ONLY = ["events", "q", "difficulty", "zone", "date", "total_count"]

function buildParams(filters: {
  q?: string | null
  difficulty?: string | null
  zone?: string | null
  date?: string | null
}): Record<string, string> {
  const params: Record<string, string> = {}
  const trimmedQ = filters.q?.trim()
  if (trimmedQ) params.q = trimmedQ
  if (filters.difficulty) params.difficulty = filters.difficulty
  if (filters.zone) params.zone = filters.zone
  if (filters.date) params.date = filters.date
  return params
}

export function ActiveFilterChips({
  q,
  difficulty,
  zone,
  date,
  path = "/events/all",
  only = DEFAULT_ONLY,
}: ActiveFilterChipsProps) {
  const chips: { key: FilterKey; label: string }[] = []

  if (q?.trim()) {
    chips.push({ key: "q", label: q.trim() })
  }

  if (difficulty) {
    chips.push({
      key: "difficulty",
      label: DIFFICULTY_FORM_LABELS[difficulty] ?? difficulty,
    })
  }

  if (zone) {
    const province = PROVINCE_OPTIONS.find((option) => option.value === zone)
    chips.push({ key: "zone", label: province?.label ?? zone })
  }

  if (date) {
    chips.push({ key: "date", label: DATE_LABELS[date] ?? date })
  }

  if (chips.length === 0) return null

  const current = { q, difficulty, zone, date }

  function visitFilters(params: Record<string, string>) {
    router.get(path, params, {
      preserveState: true,
      only,
    })
  }

  function removeFilter(key: FilterKey) {
    visitFilters(buildParams({ ...current, [key]: null }))
  }

  function clearAll() {
    visitFilters({})
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold tracking-wide text-chaski-green-dark uppercase">
        Filtros:
      </span>

      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => removeFilter(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-chaski-green-dark ring-1 ring-amber-100 hover:bg-amber-100"
          aria-label={`Quitar filtro ${chip.label}`}
        >
          {chip.label}
          <span aria-hidden className="text-base leading-none">
            ×
          </span>
        </button>
      ))}

      <button
        type="button"
        onClick={clearAll}
        className="ml-auto text-sm font-medium text-chaski-terracotta hover:underline"
      >
        Limpiar todo
      </button>
    </div>
  )
}
