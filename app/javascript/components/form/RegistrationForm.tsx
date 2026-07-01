import { Link, useForm } from "@inertiajs/react"

import FormField from "@/components/form/FormField"

export default function RegistrationForm() {
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
    <form onSubmit={submit} className="space-y-5">
      <FormField
        id="name"
        label="Nombre"
        value={data.user.name}
        onChange={(value) => setData("user.name", value)}
        error={fieldErrors.name}
        placeholder="Tu nombre"
      />

      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        value={data.user.email}
        onChange={(value) => setData("user.email", value)}
        error={fieldErrors.email}
        placeholder="tu@email.com"
      />

      <FormField
        id="password"
        label="Contraseña"
        type="password"
        value={data.user.password}
        onChange={(value) => setData("user.password", value)}
        error={fieldErrors.password}
      />

      <FormField
        id="password_confirmation"
        label="Confirmar contraseña"
        type="password"
        value={data.user.password_confirmation}
        onChange={(value) => setData("user.password_confirmation", value)}
        error={fieldErrors.password_confirmation}
      />

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
  )
}
