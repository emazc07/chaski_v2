import type { ReactNode } from "react"

import { Footer } from "./Footer"
import { Header } from "./Header"

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-chaski-bg">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}