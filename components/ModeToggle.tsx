'use client'

export type Mode = 'youtube' | 'universal'

interface ModeToggleProps {
  value: Mode
  onChange: (mode: Mode) => void
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-full bg-zinc-900 p-1 w-full">
      {(['youtube', 'universal'] as Mode[]).map((mode) => (
        <button
          key={mode}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={`flex-1 py-3 rounded-full text-base font-medium transition-colors ${
            value === mode ? 'bg-white text-black' : 'text-zinc-400'
          }`}
        >
          {mode === 'youtube' ? 'YouTube' : 'Universal'}
        </button>
      ))}
    </div>
  )
}
