import type { ReactNode } from "react"

import { Footer } from "./Footer"
import { Header } from "./Header"

type PublicLayoutProps = {
  children: ReactNode
  showFooter?: boolean
}

export default function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-chaski-bg">
      <Header />
      <main className="flex-1">{children}</main>
      {showFooter ? <Footer /> : null}
    </div>
  )
}
