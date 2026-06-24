import { Head, Link, useForm } from "@inertiajs/react"
  
import PublicLayout from "@/components/layout/PublicLayout"

const inputClassName =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

export default function UsersSessionsNew() {
  const { data, setData, post, processing, errors } = useForm({
    user: {
      email: "",
      password: "",
      remember_me: false,
    },
  })

  const fieldErrors = errors as Record<string, string>

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post("/users/sign_in")
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Head title="Iniciar sesión" />

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="mt-2 text-gray-600">
            Accede a tu cuenta para ver tus caminatas y continuar donde lo dejaste.
          </p>
        </header>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={submit} className="space-y-5">
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
                autoComplete="email"
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
                autoComplete="current-password"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember_me"
                type="checkbox"
                checked={data.user.remember_me}
                onChange={(e) => setData("user.remember_me", e.target.checked)}
                className="rounded border-gray-300 text-chaski-green focus:ring-chaski-green"
              />
              <label htmlFor="remember_me" className="text-sm text-gray-700">
                Recordarme
              </label>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={processing}
                className="rounded-full bg-chaski-green px-5 py-2.5 text-sm font-bold text-white hover:bg-chaski-green-dark disabled:opacity-50"
              >
                {processing ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>

              <Link
                href="/users/sign_up"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Crear cuenta
              </Link>
            </div>
          </form>
        </section>
      </div>
    </PublicLayout>
  )
}