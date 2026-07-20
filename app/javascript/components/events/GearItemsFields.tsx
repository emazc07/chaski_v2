import type { GearItemFormRow } from "@/types"

const inputClassName =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

const GEAR_SUGGESTIONS = [
  "Botas de montaña",
  "2L de agua",
  "Snacks energéticos",
  "Linterna frontal",
  "Cortavientos",
  "Bloqueador solar",
  "Capa de lluvia",
]

type GearItemsFieldsProps = {
  items: GearItemFormRow[]
  onChange: (items: GearItemFormRow[]) => void
}

export default function GearItemsFields({ items, onChange }: GearItemsFieldsProps) {
  const visibleItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item._destroy)

  function updateItem(index: number, patch: Partial<GearItemFormRow>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    onChange(next)
  }

  function addItem(name = "") {
    onChange([...items, { name, required: true, position: items.length }])
  }

  function removeItem(index: number) {
    const target = items[index]
    if (target.id) {
      onChange(items.map((item, i) => (i === index ? { ...item, _destroy: true } : item)))
      return
    }
    onChange(items.filter((_, i) => i !== index))
  }

  function addSuggestion(name: string) {
    const alreadyListed = items.some(
      (item) => !item._destroy && item.name.trim().toLowerCase() === name.toLowerCase(),
    )
    if (alreadyListed) return
    addItem(name)
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700">Equipo necesario</p>
        <p className="mt-1 text-sm text-gray-500">
          Lista el equipo que los hikers deben llevar. Podés usar las sugerencias.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GEAR_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => addSuggestion(suggestion)}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:border-chaski-green hover:bg-chaski-green/5 hover:text-chaski-green-dark"
          >
            + {suggestion}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visibleItems.map(({ item, index }) => (
          <div key={item.id ?? `new-${index}`} className="flex items-start gap-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, { name: e.target.value })}
              className={inputClassName}
              placeholder="Ej. Linterna frontal"
              maxLength={80}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="mt-1 shrink-0 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              aria-label="Quitar ítem"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => addItem()}
        className="text-sm font-medium text-chaski-green-dark hover:text-chaski-heading"
      >
        + Agregar ítem
      </button>
    </div>
  )
}
