export function formatEventDateShort(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)

  return date.toLocaleDateString("es-CR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

export function formatEventDateLong(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)

  return date.toLocaleDateString("es-CR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Formats a date-only ISO string (YYYY-MM-DD) as "7 de julio de 1998". */
export function formatBirthday(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number)
  if (!year || !month || !day) return value.slice(0, 10)

  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)

  return date.toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
