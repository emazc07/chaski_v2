import { Head, Link, router, usePage } from "@inertiajs/react"
import { useState } from "react"

import { EventAboutSection } from "@/components/events/EventAboutSection"
import { EventBookingCard } from "@/components/events/EventBookingCard"
import { EventGearSection } from "@/components/events/EventGearSection"
import { EventHero } from "@/components/events/EventHero"
import { EventStatsRow } from "@/components/events/EventStatsRow"
import { EventTipsCard } from "@/components/events/EventTipsCard"
import PublicLayout from "@/components/layout/PublicLayout"
import ConfirmDialog from "@/components/ui/ConfirmDialog"

import type { Event, GearItem, Inscription, SharedProps } from "@/types"

const INSCRIPTION_SUCCESS_NOTICE = "Te inscribiste en la caminata"

export default function EventsShow({
  event,
  can_manage,
  inscription,
  marked_gear_item_ids = [],
}: {
  event: Event
  can_manage: boolean
  inscription: Inscription | null
  marked_gear_item_ids?: number[]
}) {
  const { auth, flash } = usePage<SharedProps>().props
  const user = auth?.user
  const isInscribed = inscription?.status === "active"
  const inscriptionUrl = `/events/${event.id}/inscription`

  const [successDismissed, setSuccessDismissed] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const successOpen = !successDismissed && flash?.notice === INSCRIPTION_SUCCESS_NOTICE

  const gearItems = event.gear_items ?? []
  const canMarkGear = Boolean(user && isInscribed)

  function markUrl(item: GearItem) {
    return `/events/${event.id}/gear_items/${item.id}/mark`
  }

  function confirmCancelInscription() {
    setCancelOpen(false)
    router.delete(inscriptionUrl)
  }

  function dismissSuccess() {
    setSuccessDismissed(true)
  }

  const showStatusBadge = can_manage && event.status !== "published"

  const gearHint = !canMarkGear
    ? user
      ? "Inscribite para marcar lo que ya tenés."
      : "Inicia sesión e inscribite para marcar tu equipo."
    : undefined

  return (
    <PublicLayout>
      <Head title={event.title} />

      <ConfirmDialog
        open={successOpen}
        variant="success"
        title="¡Inscripción confirmada!"
        description="Ya estás inscrito en esta caminata. Podés marcar tu equipo necesario en la página del evento."
        primaryLabel="Entendido"
        onPrimary={dismissSuccess}
        onClose={dismissSuccess}
      />

      <ConfirmDialog
        open={cancelOpen}
        variant="destructive"
        title="¿Cancelar tu inscripción?"
        description="Vas a dejar de estar inscrito en esta caminata. Podés volver a inscribirte después si hay cupo."
        primaryLabel="Sí, cancelar"
        secondaryLabel="Volver"
        onPrimary={confirmCancelInscription}
        onSecondary={() => setCancelOpen(false)}
        onClose={() => setCancelOpen(false)}
      />

      <div className="bg-chaski-bg">
        <EventHero
          title={event.title}
          difficulty={event.difficulty}
          startsAt={event.starts_at}
          location={event.custom_location}
          coverImageUrl={event.cover_image_hero_url}
          status={event.status}
          showStatusBadge={showStatusBadge}
        />

        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
          <Link
            href="/events"
            className="mb-6 inline-block text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            ← Volver a caminatas
          </Link>

          <EventStatsRow
            maxParticipants={event.max_participants}
            distanceKm={event.distance_km}
            elevationGainM={event.elevation_gain_m}
            durationHours={event.duration_hours}
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <EventAboutSection
                quote={event.description_short}
                description={event.description_long}
              />

              <EventGearSection
                items={gearItems}
                markedIds={marked_gear_item_ids}
                canMark={canMarkGear}
                markUrl={markUrl}
                hint={gearHint}
              />
            </div>

            <div className="space-y-4 lg:sticky lg:top-6">
              <EventBookingCard
                priceCrc={event.price_crc}
                inscriptionUrl={inscriptionUrl}
                isInscribed={isInscribed}
                isAuthenticated={Boolean(user)}
                organizer={event.organizer}
                canManage={can_manage}
                eventId={event.id}
                onCancelClick={() => setCancelOpen(true)}
              />
              <EventTipsCard />
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
