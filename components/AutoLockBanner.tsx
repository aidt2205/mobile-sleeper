'use client'

interface AutoLockBannerProps {
  onDismiss: () => void
}

export function AutoLockBanner({ onDismiss }: AutoLockBannerProps) {
  return (
    <div className="bg-surface-container-low p-4 rounded-2xl flex gap-4 items-start relative w-full">
      <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
        <span
          className="material-symbols-outlined text-secondary text-lg"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
      </div>
      <p className="text-on-surface-variant/60 text-sm flex-1 leading-relaxed font-body">
        Für beste Ergebnisse: iOS <strong className="text-on-surface/80">Auto-Lock auf 1–2 Min</strong> stellen
      </p>
      <button
        onClick={onDismiss}
        aria-label="Banner schließen"
        className="text-on-surface-variant/30 hover:text-on-surface-variant/60 transition-colors duration-500 p-1"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  )
}
