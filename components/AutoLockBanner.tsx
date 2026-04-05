'use client'

interface AutoLockBannerProps {
  onDismiss: () => void
}

export function AutoLockBanner({ onDismiss }: AutoLockBannerProps) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 w-full">
      <span className="text-yellow-400 text-lg">⚠️</span>
      <p className="text-zinc-300 text-sm flex-1">
        Für beste Ergebnisse: iOS <strong>Auto-Lock auf 1–2 Min</strong> stellen
        (Einstellungen → Anzeige & Helligkeit)
      </p>
      <button
        onClick={onDismiss}
        aria-label="Banner schließen"
        className="text-zinc-500 text-xl px-1"
      >
        ×
      </button>
    </div>
  )
}
