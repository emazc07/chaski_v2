import { useState } from "react"
import type { FormEvent } from "react"
import { router } from "@inertiajs/react"

import { DIFFICULTY_FORM_LABELS } from "@/lib/difficulty"

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

export const PROVINCE_OPTIONS = [
  { value: "san_jose", label: "San José" },
  { value: "alajuela", label: "Alajuela" },
  { value: "cartago", label: "Cartago" },
  { value: "heredia", label: "Heredia" },
  { value: "guanacaste", label: "Guanacaste" },
  { value: "puntarenas", label: "Puntarenas" },
  { value: "limon", label: "Limón" },
] as const

const DATE_OPTIONS = [
  { value: "", label: "Fecha" },
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mes" },
] as const

type EventsFilterBarProps = {
  q?: string | null
  difficulty?: string | null
  zone?: string | null
  date?: string | null
}

export function EventsFilterBar({
  q: initialQ = "",
  difficulty: initialDifficulty = "",
  zone: initialZone = "",
  date: initialDate = "",
}: EventsFilterBarProps) {
  const [q, setQ] = useState(initialQ ?? "")
  const [difficulty, setDifficulty] = useState(initialDifficulty ?? "")
  const [zone, setZone] = useState(initialZone ?? "")
  const [date, setDate] = useState(initialDate ?? "")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params: Record<string, string> = {}
    const trimmedQ = q.trim()
    if (trimmedQ) params.q = trimmedQ
    if (difficulty) params.difficulty = difficulty
    if (zone) params.zone = zone
    if (date) params.date = date

    router.get("/events/all", params, {
      preserveState: true,
      only: ["events", "q", "difficulty", "zone", "date", "total_count"],
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80 sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Buscar caminatas</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscá por destino o palabra clave"
            className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-chaski-green focus:outline-none focus:ring-1 focus:ring-chaski-green"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:shrink-0 lg:gap-3">
          <label className="min-w-[140px]">
            <span className="sr-only">Dificultad</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-900 focus:border-chaski-green focus:outline-none focus:ring-1 focus:ring-chaski-green"
            >
              <option value="">Dificultad</option>
              {Object.entries(DIFFICULTY_FORM_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="min-w-[140px]">
            <span className="sr-only">Zona</span>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-900 focus:border-chaski-green focus:outline-none focus:ring-1 focus:ring-chaski-green"
            >
              <option value="">Zona</option>
              {PROVINCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="min-w-[140px]">
            <span className="sr-only">Fecha</span>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-900 focus:border-chaski-green focus:outline-none focus:ring-1 focus:ring-chaski-green"
            >
              {DATE_OPTIONS.map((option) => (
                <option key={option.value || "any"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="shrink-0 rounded-xl border border-chaski-green px-5 py-2.5 text-sm font-bold text-chaski-green hover:bg-chaski-green hover:text-white"
        >
          Aplicar filtros
        </button>
      </div>
    </form>
  )
}
