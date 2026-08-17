import { Link } from "@inertiajs/react"

import bannerFrame from "@/assets/HeroBanner5.png"

const BANNER_WIDTH = 1536
const BANNER_HEIGHT = 1024

type CtaLink = {
  label: string
  href: string
}

type HeroBannerProps = {
  title?: string
  titleAccent?: string
  subtitle?: string
  primaryCta?: CtaLink
  showSearch?: boolean
}

const defaultPrimaryCta: CtaLink = {
  label: "Explorar caminatas",
  href: "#proximas-caminatas",
}

export function HeroBanner({
  title = "El punto de encuentro de los caminantes de",
  titleAccent = "Costa Rica.",
  subtitle = "Buscá caminatas, conocé organizadores y sumate al grupo.\nTu próxima aventura empieza acá.",
  primaryCta = defaultPrimaryCta,
  showSearch = false,
}: HeroBannerProps) {
  return (
    <section className="bg-chaski-bg pb-8">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-6 lg:px-8 lg:pt-12 lg:pb-8">
        <div className="relative w-full">
          <img
            src={bannerFrame}
            alt=""
            aria-hidden
            width={BANNER_WIDTH}
            height={BANNER_HEIGHT}
            decoding="async"
            className="block h-auto w-full"
          />

          <div className="absolute inset-0 flex items-start justify-start px-5 pt-10 sm:px-8 sm:pt-14 lg:px-10 lg:pt-16">
            <div className="w-[min(100%,16.5rem)] text-left sm:w-[34%] sm:max-w-[19rem] lg:max-w-[21rem]">
              <p className="text-[0.65rem] font-bold tracking-[0.18em] text-chaski-green uppercase sm:text-[0.7rem]">
                Caminatas en Costa Rica
              </p>
              <h1 className="mt-3 font-serif-display text-[1.65rem] font-bold leading-[1.15] text-chaski-heading sm:text-3xl lg:text-[2.35rem]">
                {title} <span className="text-chaski-terracotta">{titleAccent}</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-[0.95rem] lg:text-base">
                {subtitle.includes("\n")
                  ? subtitle.split("\n").map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))
                  : subtitle}
              </p>
              <div className="mt-7">
                <Link
                  href={primaryCta.href}
                  className="inline-flex rounded-xl bg-chaski-green px-7 py-3 text-sm font-bold text-white hover:bg-chaski-green-dark"
                >
                  {primaryCta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSearch && <div className="mx-auto max-w-6xl px-6 lg:px-8"></div>}
    </section>
  )
}
