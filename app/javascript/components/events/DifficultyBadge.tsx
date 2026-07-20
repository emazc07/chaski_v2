import { difficultyBadgeConfig } from "@/lib/difficulty"

type DifficultyBadgeProps = {
  difficulty: string
  className?: string
}

export function DifficultyBadge({ difficulty, className = "" }: DifficultyBadgeProps) {
  const { label, className: badgeClassName } = difficultyBadgeConfig(difficulty)

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${badgeClassName} ${className}`}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-white/90" />
      {label}
    </span>
  )
}
