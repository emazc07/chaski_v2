import type { BadgeListItem } from "@/types"

type BadgeCardProps = {
  badge: BadgeListItem
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <article className="relative flex min-h-[320px] flex-col items-center rounded-xl border border-stone-200 bg-white px-5 py-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-chaski-green/30 hover:shadow-md">
      <span
        className={
          badge.earned
            ? "absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-chaski-green/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-chaski-green-dark uppercase"
            : "absolute top-4 right-4 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-stone-500 uppercase"
        }
      >
        {badge.earned ? (
          <>
            <CheckIcon />
            Obtenida
          </>
        ) : (
          "Por obtener"
        )}
      </span>

      <div className="mt-3 flex h-70 w-70 items-center justify-center">
        <img
          src={badge.image_url}
          alt={`Insignia ${badge.name}`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="mt-1 flex flex-1 flex-col">
        <h3 className="text-lg font-bold text-stone-900">{badge.name}</h3>

        <p className="mt-2 text-sm leading-5 text-stone-500">{badge.description}</p>
      </div>
    </article>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
      <path
        d="m5 10 3 3 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
