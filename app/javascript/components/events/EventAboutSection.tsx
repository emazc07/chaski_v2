type EventAboutSectionProps = {
  quote: string
  description: string
}

export function EventAboutSection({ quote, description }: EventAboutSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-chaski-heading">Sobre esta caminata</h2>

      {quote && (
        <blockquote className="mt-4 border-l-4 border-amber-400/80 bg-stone-50 py-3 pl-4 pr-3 text-base italic leading-relaxed text-stone-700">
          {quote}
        </blockquote>
      )}

      {description && (
        <div className="prose prose-stone mt-4 max-w-none whitespace-pre-line text-stone-600">
          {description}
        </div>
      )}
    </section>
  )
}
