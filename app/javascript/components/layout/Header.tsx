import { Link, usePage } from "@inertiajs/react"
    
import type { SharedProps } from "@/types"

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

function buildNavLinks(isAdmin: boolean, isLoggedIn: boolean): NavLink[] {
  return [
    { label: "Explorar caminatas", href: "/events" },
    ...(isLoggedIn ? [{ label: "Mis caminatas", href: "/hikes/mine" }] : []),
    ...(isAdmin ? [{ label: "Mis eventos", href: "/events/mine" }] : []),
    { label: "Cómo funciona", href: "#" },
    { label: "Para organizadores", href: "#" },
  ]
}

export function Header({
  navLinks: navLinksProp,
  loginHref = "/users/sign_in",
  signUpHref = "/users/sign_up",
}: HeaderProps) {
  const { auth } = usePage<SharedProps>().props
  const user = auth?.user
  const navLinks = navLinksProp ?? buildNavLinks(user?.admin ?? false, !!user)

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
          {user ? (
            <>
              <span className="text-sm font-bold text-stone-900">
                {user.name}
              </span>
              <Link
                href="/users/sign_out"
                method="delete"
                as="button"
                className="text-sm font-bold text-stone-900 hover:text-chaski-green"
              >
                Cerrar sesión
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}