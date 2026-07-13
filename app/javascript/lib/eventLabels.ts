export const difficultyLabels: Record<string, string> = {
  easy: "Fácil",
  moderate: "Moderada",
  hard: "Difícil",
  extreme: "Extrema",
}

export const routeTypeLabels: Record<string, string> = {
  loop: "Circuito",
  out_and_back: "Ida y vuelta",
  point_to_point: "Punto a punto",
}

export const statusLabels: Record<string, string> = {
  pending_review: "Pendiente de revisión",
  published: "Publicada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
  completed: "Finalizada",
}

export const statusBadgeClasses: Record<string, string> = {
  pending_review: "border-amber-200 bg-amber-50 text-amber-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  cancelled: "border-gray-200 bg-gray-100 text-gray-700",
  completed: "border-gray-200 bg-gray-100 text-gray-600",
}

export function formatStartsAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 16).replace("T", " ")

  return date.toLocaleString("es-CR", {
    dateStyle: "long",
    timeStyle: "short",
  })
}

export function formatPrice(priceCrc: number): string {
  if (priceCrc === 0) return "Gratis"

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(priceCrc)
}
