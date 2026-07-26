import { useState } from "react"
import type { FormEvent } from "react"
import { router, usePage } from "@inertiajs/react"

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

function queryFromUrl(url: string): string {
  const queryString = url.includes("?") ? (url.split("?")[1] ?? "") : ""
  return new URLSearchParams(queryString).get("q") ?? ""
}

export function HeaderSearchBar() {
  const { url } = usePage()
  const [query, setQuery] = useState(() => queryFromUrl(url))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const q = query.trim()
    router.get("/events/all", q ? { q } : {}, { preserveState: false })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-1 items-center gap-0 rounded-full border border-stone-200 bg-white pl-3.5 pr-1.5 shadow-sm focus-within:border-chaski-green focus-within:ring-1 focus-within:ring-chaski-green"
      role="search"
    >
      <label className="relative flex min-w-0 flex-1 items-center">
        <span className="sr-only">Buscar caminatas por ubicación</span>
        <SearchIcon className="pointer-events-none absolute left-0 h-4 w-4 text-stone-400" />
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscá por ubicación…"
          className="w-full border-0 bg-transparent py-2 pl-6 pr-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0"
        />
      </label>
      <button
        type="submit"
        aria-label="Buscar caminatas"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chaski-green text-white hover:bg-chaski-green-dark"
      >
        <SearchIcon className="h-3.5 w-3.5" />
      </button>
    </form>
  )
}
