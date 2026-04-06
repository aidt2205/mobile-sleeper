'use client'

export type Mode = 'youtube' | 'universal'

interface ModeToggleProps {
  value: Mode
  onChange: (mode: Mode) => void
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 p-1.5 bg-surface-container rounded-2xl w-full">
      {(['youtube', 'universal'] as Mode[]).map((mode) => {
        const active = value === mode
        return (
          <button
            key={mode}
            aria-pressed={active}
            onClick={() => onChange(mode)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
              text-base font-body font-medium transition-all duration-500
              ${active
                ? 'bg-surface-container-highest text-on-surface shadow-sm border border-outline-variant/20'
                : 'text-on-surface-variant hover:text-on-surface'
              }
            `}
          >
            <span
              className={`material-symbols-outlined text-lg ${active && mode === 'youtube' ? 'text-error' : ''}`}
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
