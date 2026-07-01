import type { ReactElement } from "react"

import { Head } from "@inertiajs/react"

import SignInForm from "@/components/form/SignInForm"
import PublicLayout from "@/components/layout/PublicLayout"

type UsersSessionsNewProps = Record<string, never>

export default function UsersSessionsNew() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Head title="Iniciar sesión" />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Iniciar sesión</h1>
        <p className="mt-2 text-gray-600">
          Accede a tu cuenta para ver tus caminatas y continuar donde lo dejaste.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <SignInForm />
      </section>
    </div>
  )
}

UsersSessionsNew.layout = (page: ReactElement<UsersSessionsNewProps>) => (
  <PublicLayout>{page}</PublicLayout>
)
