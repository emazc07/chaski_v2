import { Head, Link } from "@inertiajs/react"

import { BadgeCard } from "@/components/badges/BadgeCard"
import { Header } from "@/components/layout/Header"

import type { BadgeListItem } from "@/types"

type BadgesIndexProps = {
  badges: BadgeListItem[]
}

export default function BadgesIndex({ badges }: BadgesIndexProps) {
  return (
    <div className="flex min-h-screen flex-col bg-chaski-bg">
      <Head title="Mis insignias" />
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-16">
          <nav className="text-sm text-stone-500">
            <Link href="/profile" className="hover:text-chaski-green">
              Mi cuenta
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-stone-700">Mis insignias</span>
          </nav>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Mis insignias
            </h1>

            <span className="rounded-full bg-chaski-terracotta/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-chaski-terracotta uppercase">
              Beta
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Desbloqueá insignias especiales completando rutas y superando desafíos en Chaski. Cada
            insignia representa una aventura conquistada.
          </p>

          <section className="mt-10" aria-labelledby="badge-collection-title">
            <h2 id="badge-collection-title" className="mb-5 text-xl font-bold text-stone-900">
              Colección de insignias
            </h2>

            {badges.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
                <p className="font-semibold text-stone-700">
                  Todavía no hay insignias disponibles.
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Volvé pronto para descubrir nuevos desafíos.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
