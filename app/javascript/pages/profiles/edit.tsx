import { Head, Link, router, usePage } from "@inertiajs/react"
import { useState, type ReactNode } from "react"

import { Header } from "@/components/layout/Header"
import { formatBirthday } from "@/lib/dates"
import {
  EXPERIENCE_LEVEL_OPTIONS,
  experienceLevelLabel,
  type ExperienceLevel,
} from "@/lib/experienceLevel"

import type { SharedProps } from "@/types"

type ProfileData = {
  name: string
  bio: string | null
  location: string | null
  birthday: string | null
  experience_level: ExperienceLevel | null
  whatsapp_phone: string | null
}

type ProfileField = keyof ProfileData

type ProfilesEditProps = SharedProps & {
  profile: ProfileData
  errors?: Partial<Record<ProfileField, string | string[]>>
}

const EMPTY_LABEL = "Sin especificar"

const inputClassName =
  "w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm text-stone-900 shadow-sm focus:border-chaski-green focus:outline-none focus:ring-1 focus:ring-chaski-green"

function firstError(error: string | string[] | undefined): string | null {
  if (!error) return null
  return Array.isArray(error) ? (error[0] ?? null) : error
}

export default function ProfilesEdit({ profile, errors }: ProfilesEditProps) {
  const page = usePage<ProfilesEditProps>()
  const serverErrors = errors ?? page.props.errors
  const currentUserId = page.props.auth?.user?.id

  const initialErrorField = (
    ["name", "bio", "location", "birthday", "experience_level", "whatsapp_phone"] as const
  ).find((key) => firstError(serverErrors?.[key]))

  const [editingField, setEditingField] = useState<ProfileField | null>(initialErrorField ?? null)
  const [draft, setDraft] = useState(() =>
    initialErrorField ? (profile[initialErrorField] ?? "") : "",
  )
  const [saving, setSaving] = useState(false)

  function startEdit(field: ProfileField) {
    const value = profile[field]
    setEditingField(field)
    setDraft(value ?? "")
  }

  function cancelEdit() {
    setEditingField(null)
    setDraft("")
  }

  function saveField(field: ProfileField) {
    setSaving(true)
    router.patch(
      "/profile",
      { [field]: draft },
      {
        preserveScroll: true,
        onFinish: () => setSaving(false),
        onSuccess: () => {
          setEditingField(null)
          setDraft("")
        },
      },
    )
  }

  function displayValue(field: ProfileField): ReactNode {
    const value = profile[field]

    if (field === "birthday") {
      return value ? formatBirthday(value) : EMPTY_LABEL
    }

    if (field === "experience_level") {
      const label = experienceLevelLabel(value)
      if (!label) return EMPTY_LABEL
      return (
        <span className="inline-flex items-center gap-2">
          <MountainIcon />
          {label}
        </span>
      )
    }

    if (!value?.trim()) return EMPTY_LABEL
    return value
  }

  const fields: {
    key: ProfileField
    label: string
    type: "text" | "textarea" | "date" | "select"
    hint?: string
  }[] = [
    { key: "name", label: "Nombre completo", type: "text" },
    { key: "bio", label: "Acerca de vos", type: "textarea" },
    { key: "location", label: "Ubicación", type: "text" },
    { key: "birthday", label: "Fecha de nacimiento", type: "date" },
    { key: "experience_level", label: "Nivel de experiencia", type: "select" },
    {
      key: "whatsapp_phone",
      label: "WhatsApp",
      type: "text",
      hint: "Con código de país, solo dígitos. Ej: 50688887777. Necesario para organizar caminatas.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-chaski-bg">
      <Header />
      <main className="flex-1">
        <Head title="Información personal" />

        <div className="mx-auto max-w-5xl px-6 pt-8 pb-16">
          <nav className="text-sm text-stone-500">
            <Link href="/profile" className="hover:text-chaski-green">
              Mi cuenta
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-stone-700">Información personal</span>
          </nav>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Información personal
          </h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div>
              <section className="rounded-xl border border-stone-200 bg-white px-5 sm:px-6">
                {fields.map((field, index) => {
                  const isEditing = editingField === field.key
                  const error = firstError(serverErrors?.[field.key])
                  const isEmpty =
                    field.key !== "experience_level"
                      ? !profile[field.key]?.toString().trim()
                      : !profile.experience_level

                  return (
                    <div
                      key={field.key}
                      className={index > 0 ? "border-t border-stone-200" : undefined}
                    >
                      <div className="py-5">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                            {field.label}
                          </p>
                          {!isEditing && (
                            <button
                              type="button"
                              onClick={() => startEdit(field.key)}
                              className="shrink-0 text-sm font-semibold text-chaski-green hover:text-chaski-green-dark"
                            >
                              Editar
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="mt-3">
                            {field.type === "textarea" ? (
                              <textarea
                                id={`profile-${field.key}`}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                rows={4}
                                className={inputClassName}
                                autoFocus
                              />
                            ) : field.type === "select" ? (
                              <select
                                id={`profile-${field.key}`}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                className={inputClassName}
                                autoFocus
                              >
                                <option value="">Seleccionar…</option>
                                {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                id={`profile-${field.key}`}
                                type={field.type}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                className={inputClassName}
                                autoFocus
                                required={field.key === "name"}
                                inputMode={field.key === "whatsapp_phone" ? "tel" : undefined}
                                placeholder={
                                  field.key === "whatsapp_phone" ? "50688887777" : undefined
                                }
                              />
                            )}

                            {field.hint && (
                              <p className="mt-2 text-xs leading-relaxed text-stone-500">
                                {field.hint}
                              </p>
                            )}

                            {error && (
                              <p className="mt-2 text-sm text-red-600" role="alert">
                                {error}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={saving || (field.key === "name" && !draft.trim())}
                                onClick={() => saveField(field.key)}
                                className="rounded-lg bg-chaski-green px-4 py-2 text-sm font-bold text-white hover:bg-chaski-green-dark disabled:opacity-50"
                              >
                                {saving ? "Guardando…" : "Guardar cambios"}
                              </button>
                              <button
                                type="button"
                                disabled={saving}
                                onClick={cancelEdit}
                                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p
                            className={`mt-2 text-base leading-relaxed ${
                              isEmpty
                                ? "font-medium text-stone-400"
                                : "font-semibold text-stone-900"
                            }`}
                          >
                            {displayValue(field.key)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </section>

              <aside className="mt-6 flex gap-4 rounded-xl bg-chaski-green/10 px-5 py-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chaski-green/20 text-chaski-green">
                  <LockIcon />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">
                    Privacidad y seguridad de datos
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                    Toda tu información está protegida bajo estándares de cifrado modernos. Nunca
                    compartiremos tus datos personales con terceros sin tu consentimiento explícito.
                    Podés gestionar qué información es visible públicamente desde tu perfil de
                    caminante.
                  </p>
                </div>
              </aside>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-chaski-green/15 text-chaski-green">
                  <InfoIcon />
                </span>
                <h2 className="mt-3 text-base font-bold text-stone-900">Tu información personal</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  Usamos estos datos para personalizar tu experiencia, conectarte con grupos
                  cercanos y cuidar tu seguridad en las rutas.
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Solo tu nombre y “Acerca de vos” son visibles para otros usuarios.",
                    "Tu WhatsApp se usa solo para que hikers te contacten al solicitar cupo.",
                    "Tu ubicación nos ayuda a recomendarte rutas cercanas.",
                    "El nivel de experiencia garantiza tu seguridad en rutas técnicas.",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-snug text-stone-600">
                      <span className="mt-0.5 shrink-0 text-chaski-green">
                        <CheckIcon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                {currentUserId && (
                  <Link
                    href={`/profiles/${currentUserId}`}
                    className="mt-5 inline-flex text-sm font-semibold text-chaski-green hover:text-chaski-green-dark"
                  >
                    Ver mi perfil público ›
                  </Link>
                )}
              </div>

              <div className="rounded-xl border border-stone-200/80 bg-stone-50/80 px-5 py-5">
                <p className="text-sm leading-relaxed text-stone-600 italic">
                  “No es la montaña la que conquistamos, sino a nosotros mismos.”
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                  <MountainIcon className="h-4 w-4 text-chaski-green" />
                  Comunidad Chaski
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

function MountainIcon({
  className = "h-4 w-4 shrink-0 text-chaski-green",
}: {
  className?: string
}) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 20 6.5-10 4 6 2.5-3.5L21 20H3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 13 16 9l5 11" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
