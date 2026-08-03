type Stat = {
  label: string
  value: string
  icon: "people" | "path" | "mountain" | "clock"
}

type EventStatsRowProps = {
  maxParticipants: number
  distanceKm: string | number
  elevationGainM: number
  durationHours: string | number
}

export function EventStatsRow({
  maxParticipants,
  distanceKm,
  elevationGainM,
  durationHours,
}: EventStatsRowProps) {
  const stats: Stat[] = [
    {
      label: "Cupo",
      value: `${maxParticipants} cupos`,
      icon: "people",
    },
    {
      label: "Distancia",
      value: `${distanceKm} km`,
      icon: "path",
    },
    {
      label: "Elevación",
      value: `${Number(elevationGainM).toLocaleString("es-CR")} m`,
      icon: "mountain",
    },
    {
      label: "Duración",
      value: `${durationHours} horas`,
      icon: "clock",
    },
  ]

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl bg-stone-100/90 px-4 py-3.5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-chaski-green-dark shadow-sm">
            <StatIcon name={stat.icon} />
          </span>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              {stat.label}
            </dt>
            <dd className="mt-0.5 text-sm font-bold text-stone-900">{stat.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

function StatIcon({ name }: { name: Stat["icon"] }) {
  const className = "h-5 w-5"
  const common = {
    className,
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  }

  if (name === "people") {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        />
      </svg>
    )
  }

  if (name === "path") {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13 6-3m-6 3V7m6 10 5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    )
  }

  if (name === "mountain") {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3 20 7-12 4 7 2-3 5 8H3z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      />
    </svg>
  )
}
