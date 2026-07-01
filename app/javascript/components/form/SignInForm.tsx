import { Link, useForm } from "@inertiajs/react"

import FormCheckboxField from "@/components/form/FormCheckboxField"
import FormField from "@/components/form/FormField"

export default function SignInForm() {
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
    <form onSubmit={submit} className="space-y-5">
      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        value={data.user.email}
        onChange={(value) => setData("user.email", value)}
        error={fieldErrors.email}
        placeholder="tu@email.com"
        autoComplete="email"
      />

      <FormField
        id="password"
        label="Contraseña"
        type="password"
        value={data.user.password}
        onChange={(value) => setData("user.password", value)}
        error={fieldErrors.password}
        autoComplete="current-password"
      />

      <FormCheckboxField
        id="remember_me"
        label="Recordarme"
        checked={data.user.remember_me}
        onChange={(checked) => setData("user.remember_me", checked)}
      />

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
  )
}
