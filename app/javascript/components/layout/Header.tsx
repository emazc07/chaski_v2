import { Link, usePage } from "@inertiajs/react"

import type { SharedProps } from "@/types"

import { ChaskiLogo } from "./ChaskiLogo"
import { HeaderSearchBar } from "./HeaderSearchBar"

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
    ...(isLoggedIn ? [{ label: "Mis caminatas", href: "/hikes/mine" }] : []),
    ...(isAdmin ? [{ label: "Mis eventos", href: "/events/mine" }] : []),
  ]
}

export function Header({
  navLinks: navLinksProp,
  loginHref = "/users/sign_in",
  signUpHref = "/users/sign_up",
}: HeaderProps) {
  const { url, props } = usePage<SharedProps>()
  const user = props.auth?.user
  const navLinks = navLinksProp ?? buildNavLinks(user?.admin ?? false, !!user)

  return (
    <header className="border-b border-stone-200/60 bg-chaski-bg">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-3 lg:px-10">
        <div className="flex h-[57px] items-center justify-between gap-4 md:gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-6 lg:gap-10">
            <ChaskiLogo />

            <div className="hidden min-w-0 flex-1 md:block">
              <HeaderSearchBar key={url} />
            </div>

            {navLinks.length > 0 && (
              <nav className="hidden shrink-0 items-center gap-6 lg:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="whitespace-nowrap text-sm font-bold text-stone-900 hover:text-chaski-green"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="hidden items-center gap-2 text-stone-900 hover:text-chaski-green sm:inline-flex"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-chaski-green/15 text-xs font-bold text-chaski-green-dark"
                    >
                      {user.name
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase() || "?"}
                    </span>
                  )}
                  <span className="text-sm font-bold">{user.name}</span>
                </Link>
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

        <div className="md:hidden">
          <HeaderSearchBar key={url} />
        </div>

        {navLinks.length > 0 && (
          <nav className="flex items-center gap-4 overflow-x-auto pb-1 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-sm font-bold text-stone-900 hover:text-chaski-green"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
