import type { ReactNode } from "react"
import { Link } from "@inertiajs/react"

import { ChaskiLogo } from "./ChaskiLogo"

type FooterLink = {
  label: string
  href: string
}

type FooterProps = {
  description?: string
  platformLinks?: FooterLink[]
  legalLinks?: FooterLink[]
  copyright?: string
}

const defaultPlatformLinks: FooterLink[] = [
  { label: "Sobre Chaski", href: "#" },
  { label: "Cómo funciona", href: "#" },
  { label: "Para organizadores", href: "#" },
  { label: "Contacto", href: "#" },
]

const defaultLegalLinks: FooterLink[] = [
  { label: "Términos de servicio", href: "#" },
  { label: "Política de privacidad", href: "#" },
]


function FooterLinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-sm font-bold text-stone-900 hover:text-chaski-green"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function FooterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-[10px] font-bold tracking-wide text-stone-500 uppercase">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function Footer({
  description = "El punto de encuentro de los caminantes de Costa Rica. Fomentando la comunidad y la aventura en cada montaña.",
  platformLinks = defaultPlatformLinks,
  legalLinks = defaultLegalLinks,
  copyright = `© ${new Date().getFullYear()} Chaski. Hecho con ❤️ en Costa Rica.`,
}: FooterProps) {
  return (
    <footer className="border-t border-stone-200/60 bg-chaski-bg">
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <ChaskiLogo />
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              {description}
            </p>
          </div>

          <FooterSection title="Plataforma">
            <FooterLinkList links={platformLinks} />
          </FooterSection>

          <div className="space-y-8">
            <FooterSection title="Legal">
              <FooterLinkList links={legalLinks} />
            </FooterSection>

            
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200/60 pt-6 text-center text-sm text-stone-600">
          {copyright}
        </div>
      </div>
    </footer>
  )
}