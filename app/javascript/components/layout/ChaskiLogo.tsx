import { Link } from "@inertiajs/react"

export function ChaskiLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-chaski-green">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path fill="white" d="M4 17 9 7l3.5 6L16 5l4 12H4z" />
        </svg>
      </span>
      <span className="text-xl font-bold text-chaski-green">Chaski</span>
    </Link>
  )
}
