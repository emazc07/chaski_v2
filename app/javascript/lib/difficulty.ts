export type Difficulty = "easy" | "moderate" | "hard" | "extreme"

export const DIFFICULTY_FORM_LABELS: Record<string, string> = {
  easy: "Fácil",
  moderate: "Moderada",
  hard: "Difícil",
  extreme: "Extrema",
}

export type DifficultyBadgeConfig = {
  label: string
  className: string
}

export const DIFFICULTY_BADGE_CONFIG: Record<string, DifficultyBadgeConfig> = {
  easy: {
    label: "Principiante",
    className: "bg-chaski-green text-white",
  },
  moderate: {
    label: "Intermedio",
    className: "bg-amber-700 text-white",
  },
  hard: {
    label: "Avanzado",
    className: "bg-orange-600 text-white",
  },
  extreme: {
    label: "Extrema",
    className: "bg-red-600 text-white",
  },
}

export function difficultyFormLabel(value: string): string {
  return DIFFICULTY_FORM_LABELS[value] ?? value
}

export function difficultyBadgeConfig(value: string): DifficultyBadgeConfig {
  return (
    DIFFICULTY_BADGE_CONFIG[value] ?? {
      label: value,
      className: "bg-stone-600 text-white",
    }
  )
}