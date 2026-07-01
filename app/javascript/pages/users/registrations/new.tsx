import type { ReactElement } from "react"

import { Head } from "@inertiajs/react"

import RegistrationForm from "@/components/form/RegistrationForm"
import PublicLayout from "@/components/layout/PublicLayout"

type UsersRegistrationsNewProps = Record<string, never>

export default function UsersRegistrationsNew() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Head title="Crear cuenta" />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="mt-2 text-gray-600">
          Regístrate para guardar tus caminatas y conectar con otros caminantes.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <RegistrationForm />
      </section>
    </div>
  )
}

UsersRegistrationsNew.layout = (page: ReactElement<UsersRegistrationsNewProps>) => (
  <PublicLayout>{page}</PublicLayout>
)
