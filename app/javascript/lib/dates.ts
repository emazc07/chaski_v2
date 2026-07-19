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
