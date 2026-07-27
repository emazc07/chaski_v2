import { useEffect } from "react"

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  variant: "success" | "destructive"
  primaryLabel: string
  onPrimary: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  onClose: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  variant,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const isSuccess = variant === "success"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center text-center">
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-full bg-chaski-green/15 text-chaski-green"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-7 w-7"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>

            <h2 id="confirm-dialog-title" className="mt-5 text-xl font-bold text-gray-900">
              {title}
            </h2>
            <p
              id="confirm-dialog-description"
              className="mt-3 text-sm leading-relaxed text-gray-700"
            >
              {description}
            </p>

            <button
              type="button"
              onClick={onPrimary}
              className="mt-8 w-full rounded-md bg-chaski-green px-4 py-3 text-sm font-bold tracking-wide text-white uppercase hover:bg-chaski-green-dark"
            >
              {primaryLabel}
            </button>
          </div>
        ) : (
          <div>
            <h2 id="confirm-dialog-title" className="pr-8 text-xl font-bold text-gray-900">
              {title}
            </h2>
            <p
              id="confirm-dialog-description"
              className="mt-3 text-sm leading-relaxed text-gray-700"
            >
              {description}
            </p>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              {secondaryLabel && onSecondary && (
                <button
                  type="button"
                  onClick={onSecondary}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  {secondaryLabel}
                </button>
              )}
              <button
                type="button"
                onClick={onPrimary}
                className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
