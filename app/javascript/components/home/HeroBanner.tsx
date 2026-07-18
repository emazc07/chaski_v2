import { Link } from "@inertiajs/react"

import bannerFrame from "@/assets/hiking-banner-frame-2048x1090.png"

const BANNER_WIDTH = 2048
const BANNER_HEIGHT = 1090

type CtaLink = {
  label: string
  href: string
}

type HeroBannerProps = {
  title?: string
  titleAccent?: string
  subtitle?: string
  primaryCta?: CtaLink
  secondaryCta?: CtaLink
  showSearch?: boolean
}

const defaultPrimaryCta: CtaLink = {
  label: "Explorar caminatas",
  href: "#proximas-caminatas",
}

const defaultSecondaryCta: CtaLink = {
  label: "Soy organizador",
  href: "/users/sign_up",
}

export function HeroBanner({
  title = "El punto de encuentro de los caminantes de",
  titleAccent = "Costa Rica.",
  subtitle = "Buscá caminatas, conocé organizadores y sumate al grupo.\nTu próxima aventura empieza acá.",
  primaryCta = defaultPrimaryCta,
  secondaryCta = defaultSecondaryCta,
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

          <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-16 lg:px-24">
            <div className="max-w-md text-center sm:max-w-lg">
              <h1 className="font-serif-display text-[1.35rem] font-bold leading-tight text-chaski-heading sm:text-[1.65rem] lg:text-[1.85rem]">
                {title}{" "}
                <span className="text-chaski-terracotta">{titleAccent}</span>
              </h1>
              <p className="mt-3 text-xs leading-relaxed text-stone-600 sm:text-sm">
                {subtitle.includes("\n") ? (
                  subtitle.split("\n").map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))
                ) : (
                  subtitle
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href={primaryCta.href}
            className="rounded-full bg-chaski-green px-7 py-3 text-sm font-bold text-white hover:bg-chaski-green-dark"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="rounded-full border border-stone-300 bg-white px-7 py-3 text-sm font-bold text-stone-800 hover:border-chaski-green hover:text-chaski-green-dark"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      {showSearch && (
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
        </div>
      )}
    </section>
  )
}
