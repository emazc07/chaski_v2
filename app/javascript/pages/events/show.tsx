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
const INSCRIPTION_PENDING_NOTICE =
  "Solicitaste cupo. Contactá al organizador por WhatsApp y confirmá con el código."

export default function EventsShow({
  event,
  can_manage,
  inscription,
  marked_gear_item_ids = [],
  whatsapp_url = null,
  confirmation_code = null,
  is_past = false,
}: {
  event: Event
  can_manage: boolean
  inscription: Inscription | null
  marked_gear_item_ids?: number[]
  whatsapp_url?: string | null
  confirmation_code?: string | null
  is_past?: boolean
}) {
  const { auth, flash } = usePage<SharedProps>().props
  const user = auth?.user
  const inscriptionStatus = inscription?.status ?? null
  const isInscribed = inscriptionStatus === "active"
  const inscriptionUrl = `/events/${event.id}/inscription`
  const confirmUrl = `/events/${event.id}/inscription/confirm`

  const [successDismissed, setSuccessDismissed] = useState(false)
  const [pendingDismissed, setPendingDismissed] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const successOpen = !successDismissed && flash?.notice === INSCRIPTION_SUCCESS_NOTICE
  const pendingOpen = !pendingDismissed && flash?.notice === INSCRIPTION_PENDING_NOTICE

  const gearItems = event.gear_items ?? []
  const canMarkGear = Boolean(user && isInscribed && !is_past)

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

  function dismissPending() {
    setPendingDismissed(true)
  }

  const showStatusBadge = can_manage && event.status !== "published"

  const gearHint = !canMarkGear
    ? is_past
      ? "Esta caminata ya pasó. El checklist de equipo es solo de consulta."
      : user
        ? inscriptionStatus === "pending"
          ? "Confirmá tu inscripción con el código del organizador para marcar tu equipo."
          : "Inscribite para marcar lo que ya tenés."
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
        open={pendingOpen}
        variant="success"
        title="Cupo solicitado"
        description="Escribile al organizador por WhatsApp para coordinar. Cuando te pase el código, ingresalo acá para confirmar tu inscripción."
        primaryLabel="Entendido"
        onPrimary={dismissPending}
        onClose={dismissPending}
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
            href={is_past && isInscribed ? "/hikes/mine" : "/events"}
            className="mb-6 inline-block text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            {is_past && isInscribed ? "← Volver a mis caminatas" : "← Volver a caminatas"}
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
                confirmUrl={confirmUrl}
                inscriptionStatus={inscriptionStatus}
                isAuthenticated={Boolean(user)}
                organizer={event.organizer}
                canManage={can_manage}
                eventId={event.id}
                whatsappUrl={whatsapp_url}
                confirmationCode={confirmation_code}
                codeError={flash?.alert ?? null}
                isPast={is_past}
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
