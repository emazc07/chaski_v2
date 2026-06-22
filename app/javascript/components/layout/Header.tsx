import { Link } from "@inertiajs/react"

import { ChaskiLogo } from "./ChaskiLogo"

type NavLink = {
  label: string
  href: string
}

type HeaderProps = {
  navLinks?: NavLink[]
  loginHref?: string
  signUpHref?: string
}

const defaultNavLinks: NavLink[] = [
  { label: "Explorar caminatas", href: "#" },
  { label: "Cómo funciona", href: "#" },
  { label: "Para organizadores", href: "#" },
]

export function Header({
  navLinks = defaultNavLinks,
  loginHref = "#",
  signUpHref = "#",
}: HeaderProps) {
  return (
    <header className="h-[81px] border-b border-stone-200/60 bg-chaski-bg">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-10 lg:gap-16">
          <ChaskiLogo />

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-stone-900 hover:text-chaski-green"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href={loginHref}
            className="text-sm font-bold text-stone-900 hover:text-chaski-green"
          >
            Iniciar sesión
          </Link>
          <Link
            href={signUpHref}
            className="rounded-full bg-chaski-green px-5 py-2.5 text-sm font-bold text-white hover:bg-chaski-green-dark"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  )
}