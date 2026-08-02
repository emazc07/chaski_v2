export type ExperienceLevel = "beginner" | "intermediate" | "advanced"

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
}

export const EXPERIENCE_LEVEL_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "beginner", label: EXPERIENCE_LEVEL_LABELS.beginner },
  { value: "intermediate", label: EXPERIENCE_LEVEL_LABELS.intermediate },
  { value: "advanced", label: EXPERIENCE_LEVEL_LABELS.advanced },
]

export function experienceLevelLabel(value: string | null | undefined): string | null {
  if (!value) return null
  return EXPERIENCE_LEVEL_LABELS[value as ExperienceLevel] ?? value
}
