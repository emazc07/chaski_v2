import { Head, Link, useForm } from "@inertiajs/react"
  
import PublicLayout from "@/components/layout/PublicLayout"

const inputClassName =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

export default function UsersRegistrationsNew() {
  const { data, setData, post, processing, errors } = useForm({
    user: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  })

  const fieldErrors = errors as Record<string, string>

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post("/users")
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Head title="Crear cuenta" />

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="mt-2 text-gray-600">
            Regístrate para guardar tus caminatas y conectar con otros caminantes.
          </p>
        </header>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={data.user.name}
                onChange={(e) => setData("user.name", e.target.value)}
                className={inputClassName}
                placeholder="Tu nombre"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={data.user.email}
                onChange={(e) => setData("user.email", e.target.value)}
                className={inputClassName}
                placeholder="tu@email.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={data.user.password}
                onChange={(e) => setData("user.password", e.target.value)}
                className={inputClassName}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirmar contraseña
              </label>
              <input
                id="password_confirmation"
                type="password"
                value={data.user.password_confirmation}
                onChange={(e) => setData("user.password_confirmation", e.target.value)}
                className={inputClassName}
              />
              {fieldErrors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password_confirmation}</p>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={processing}
                className="rounded-full bg-chaski-green px-5 py-2.5 text-sm font-bold text-white hover:bg-chaski-green-dark disabled:opacity-50"
              >
                {processing ? "Creando cuenta..." : "Crear cuenta"}
              </button>

              <Link
                href="/users/sign_in"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </form>
        </section>
      </div>
    </PublicLayout>
  )
}