'use client'

export type Mode = 'youtube' | 'universal'

interface ModeToggleProps {
  value: Mode
  onChange: (mode: Mode) => void
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="relative flex gap-1.5 p-1.5 bg-surface-container-lowest rounded-2xl w-full">
      {/* Sliding indicator */}
      <div
        className={`
          absolute top-1.5 bottom-1.5 w-[calc(50%-9px)] rounded-xl
          bg-surface-container-highest
          shadow-[0_0_20px_rgba(186,195,255,0.06)]
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${value === 'universal' ? 'left-[calc(50%+3px)]' : 'left-1.5'}
        `}
      />
      {(['youtube', 'universal'] as Mode[]).map((mode) => {
        const active = value === mode
        return (
          <button
            key={mode}
            aria-pressed={active}
            onClick={() => onChange(mode)}
            className={`
              relative z-10 flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl
              text-sm font-body font-semibold transition-colors duration-500
              ${active ? 'text-on-surface' : 'text-on-surface-variant/50 hover:text-on-surface-variant'}
            `}
          >
            <span
              className={`material-symbols-outlined text-lg transition-colors duration-500 ${active && mode === 'youtube' ? 'text-error' : ''}`}
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {mode === 'youtube' ? 'smart_display' : 'language'}
            </span>
            {mode === 'youtube' ? 'YouTube' : 'Universal'}
          </button>
        )
      })}
    </div>
  )
}
