import { Head } from '@inertiajs/react'
import { ChaskiHow } from "@/components/layout/ChaskiHow"
import PublicLayout from "@/components/layout/PublicLayout"

export default function Home() {
  return (
    <PublicLayout>
      <Head title="Chaski" />

      <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-gray-900">Proximas Caminatas</h1>
      </div>

      <ChaskiHow />
    </PublicLayout>
  )
}
