'use client'

interface AutoLockBannerProps {
  onDismiss: () => void
}

export function AutoLockBanner({ onDismiss }: AutoLockBannerProps) {
  return (
    <div className="bg-surface-container-low p-4 rounded-2xl flex gap-4 items-start relative w-full">
      <div className="bg-secondary/20 p-2 rounded-full">
        <span
          className="material-symbols-outlined text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
      </div>
      <p className="text-on-surface-variant text-sm flex-1 leading-relaxed">
        Für beste Ergebnisse: iOS <strong className="text-on-surface">Auto-Lock auf 1–2 Min</strong> stellen
        (Einstellungen → Anzeige & Helligkeit)
      </p>
      <button
        onClick={onDismiss}
        aria-label="Banner schließen"
        className="text-on-surface-variant hover:text-on-surface transition-colors duration-500"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  )
}
