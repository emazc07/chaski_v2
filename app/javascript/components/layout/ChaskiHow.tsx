import type { ReactNode } from "react"

type Step = {
  title: string
  description: string
  icon: ReactNode
}

const defaultSteps: Step[] = [
  {
    title: "Descubrí",
    description:
      "Encontrá caminatas según tu nivel, zona y fecha. Filtrá por lo que más te guste.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: "Inscribite",
    description:
      "Sumate a un grupo con un click. Sin formularios infinitos, gratis y sin complicaciones.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Caminá",
    description:
      "Encontrá tu próxima cumbre y conocé tu próxima tribu en el sendero.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14" />
        <path d="m12 2 4 5.5H8L12 2Z" />
        <path d="M12 7.5V14" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
]

type ChaskiHowProps = {
  title?: string
  subtitle?: string
  steps?: Step[]
}

function StepCard({ title, description, icon }: Step) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-stone-100 text-chaski-green-dark">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-bold text-stone-900">{title}</h3>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-600">
        {description}
      </p>
    </div>
  )
}

export function ChaskiHow({
  title = "Cómo funciona Chaski",
  subtitle = "Diseñamos la plataforma para que tu única preocupación sea disfrutar del camino.",
  steps = defaultSteps,
}: ChaskiHowProps) {
  return (
    <section className="bg-[#f8f9fa] py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-12 sm:mt-16 md:grid-cols-3 md:gap-8 lg:gap-12">
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
