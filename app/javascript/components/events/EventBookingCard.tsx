import { Link, router } from "@inertiajs/react"
import { useState, type FormEvent } from "react"

import { formatPrice } from "@/lib/eventLabels"

import type { EventOrganizer } from "@/types"

type EventBookingCardProps = {
  priceCrc: number
  inscriptionUrl: string
  confirmUrl: string
  inscriptionStatus: string | null
  isAuthenticated: boolean
  organizer?: EventOrganizer | null
  canManage: boolean
  eventId: number
  whatsappUrl: string | null
  confirmationCode: string | null
  codeError?: string | null
  isPast?: boolean
  onCancelClick: () => void
}

function organizerInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function EventBookingCard({
  priceCrc,
  inscriptionUrl,
  confirmUrl,
  inscriptionStatus,
  isAuthenticated,
  organizer,
  canManage,
  eventId,
  whatsappUrl,
  confirmationCode,
  codeError = null,
  isPast = false,
  onCancelClick,
}: EventBookingCardProps) {
  const priceLabel = formatPrice(priceCrc)
  const isPending = inscriptionStatus === "pending"
  const isActive = inscriptionStatus === "active"
  const [code, setCode] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [dismissedError, setDismissedError] = useState<string | null>(null)
  const showCodeError = Boolean(codeError) && codeError !== dismissedError

  function submitCode(e: FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setDismissedError(null)
    setConfirming(true)
    router.post(
      confirmUrl,
      { code: code.trim() },
      {
        preserveScroll: true,
        onFinish: () => setConfirming(false),
      },
    )
  }

  function regenerateCode() {
    router.patch(`/events/${eventId}/regenerate_confirmation_code`, {}, { preserveScroll: true })
  }

  return (
    <aside className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
        Costo estimado
      </p>
      <p className="mt-1 text-2xl font-bold text-stone-900">
        {priceCrc === 0 ? (
          priceLabel
        ) : (
          <>
            {priceLabel}
            <span className="text-base font-medium text-stone-500"> /persona</span>
          </>
        )}
      </p>

      <div className="mt-5">
        {isPast ? (
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-medium text-stone-800">Esta caminata ya pasó</p>
            {isActive ? (
              <p className="mt-2 text-xs leading-relaxed text-stone-600">
                Participaste en esta caminata. Ya no se puede modificar la inscripción.
              </p>
            ) : canManage ? (
              <p className="mt-2 text-xs leading-relaxed text-stone-600">
                La caminata finalizó. Ya no se puede editar ni regenerar el código.
              </p>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-stone-600">
                Las inscripciones están cerradas.
              </p>
            )}
          </div>
        ) : canManage ? (
          <div className="rounded-lg border border-chaski-green/30 bg-chaski-green/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-chaski-green-dark">
              Código de confirmación
            </p>
            <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-stone-900">
              {confirmationCode ?? "—"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-stone-600">
              Compartí este código por WhatsApp con quien quieras confirmar en la caminata.
            </p>
            <button
              type="button"
              onClick={regenerateCode}
              className="mt-3 text-sm font-semibold text-chaski-green hover:text-chaski-green-dark"
            >
              Regenerar código
            </button>
          </div>
        ) : !isAuthenticated ? (
          <>
            <Link
              href="/users/sign_in"
              className="flex w-full items-center justify-center rounded-lg bg-chaski-green px-4 py-3 text-sm font-semibold text-white hover:bg-chaski-green-dark"
            >
              Solicitar cupo
            </Link>
            <p className="mt-3 text-center text-xs leading-relaxed text-stone-500">
              Iniciá sesión para solicitar cupo y coordinar con el organizador por WhatsApp.
            </p>
          </>
        ) : isActive ? (
          <>
            <p className="text-sm font-medium text-chaski-green-dark">
              Ya estás inscrito en esta caminata.
            </p>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
              onClick={onCancelClick}
            >
              Cancelar inscripción
            </button>
          </>
        ) : isPending ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-amber-800">
              Cupo solicitado — pendiente de confirmación
            </p>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-lg bg-chaski-green px-4 py-3 text-sm font-semibold text-white hover:bg-chaski-green-dark"
              >
                Abrir WhatsApp
              </a>
            ) : (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                El organizador aún no agregó WhatsApp. Volvé más tarde o escribinos si necesitás
                ayuda.
              </p>
            )}
            <form onSubmit={submitCode} className="space-y-2">
              <label
                htmlFor="confirmation-code"
                className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500"
              >
                Código del organizador
              </label>
              <input
                id="confirmation-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  if (codeError) setDismissedError(codeError)
                }}
                maxLength={8}
                autoComplete="off"
                placeholder="ABC123"
                aria-invalid={showCodeError}
                aria-describedby={showCodeError ? "confirmation-code-error" : undefined}
                className={`w-full rounded-lg border px-3 py-2.5 font-mono text-sm tracking-widest text-stone-900 shadow-sm focus:outline-none focus:ring-1 ${
                  showCodeError
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-stone-300 focus:border-chaski-green focus:ring-chaski-green"
                }`}
              />
              {showCodeError && (
                <p id="confirmation-code-error" className="text-sm text-red-600" role="alert">
                  {codeError}
                </p>
              )}
              <button
                type="submit"
                disabled={confirming || !code.trim()}
                className="flex w-full items-center justify-center rounded-lg border border-chaski-green px-4 py-3 text-sm font-semibold text-chaski-green hover:bg-chaski-green/5 disabled:opacity-50"
              >
                {confirming ? "Confirmando…" : "Confirmar inscripción"}
              </button>
            </form>
            <button
              type="button"
              className="w-full text-center text-xs font-medium text-stone-500 hover:text-red-700"
              onClick={onCancelClick}
            >
              Cancelar solicitud
            </button>
          </div>
        ) : (
          <>
            <Link
              href={inscriptionUrl}
              method="post"
              as="button"
              className="flex w-full items-center justify-center rounded-lg bg-chaski-green px-4 py-3 text-sm font-semibold text-white hover:bg-chaski-green-dark"
            >
              Solicitar cupo
            </Link>
            <p className="mt-3 text-center text-xs leading-relaxed text-stone-500">
              Vas a contactar al organizador por WhatsApp y confirmar con un código para completar
              la inscripción.
            </p>
          </>
        )}
      </div>

      {organizer && (
        <>
          <hr className="my-5 border-stone-100" />
          <div className="flex items-center gap-3">
            {organizer.avatar_url ? (
              <img
                src={organizer.avatar_url}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-chaski-green/15 text-sm font-bold text-chaski-green-dark"
              >
                {organizerInitials(organizer.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-900">{organizer.name}</p>
              <p className="text-xs text-stone-500">Organizador</p>
            </div>
          </div>
        </>
      )}

      {canManage && !isPast && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-stone-100 pt-5">
          <Link
            href={`/events/${eventId}/edit`}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Editar
          </Link>
          <Link
            href={`/events/${eventId}`}
            method="delete"
            as="button"
            className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            onBefore={() => window.confirm("¿Eliminar esta caminata?")}
          >
            Eliminar
          </Link>
        </div>
      )}
    </aside>
  )
}
