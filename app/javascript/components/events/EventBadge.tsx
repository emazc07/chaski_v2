type EventBadgeProps = {
  label: string
  className?: string
}

const defaultClassName = "bg-gray-100 text-gray-700"

export default function EventBadge({ label, className = defaultClassName }: EventBadgeProps) {
  return <span className={`rounded-full px-3 py-1 text-sm font-medium ${className}`}>{label}</span>
}
