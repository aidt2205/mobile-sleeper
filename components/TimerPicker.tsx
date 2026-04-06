'use client'

const PRESETS = [15, 30, 45, 60]

interface TimerPickerProps {
  value: number
  onChange: (minutes: number) => void
}

export function TimerPicker({ value, onChange }: TimerPickerProps) {
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10)
    if (isNaN(raw)) return
    onChange(Math.min(180, Math.max(1, raw)))
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-wrap justify-center gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            aria-pressed={value === preset}
            onClick={() => onChange(preset)}
            className={`
              min-w-[56px] px-5 py-3 rounded-full text-base font-label font-semibold
              transition-all duration-500 active:scale-95
              ${value === preset
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'bg-surface-container-highest text-on-surface-variant hover:opacity-80'
              }
            `}
          >
            {preset}
          </button>
        ))}
      </div>
      <div className="relative">
        <input
          type="number"
          min={1}
          max={180}
          value={value}
          onChange={handleCustomChange}
          aria-label="Dauer in Minuten"
          placeholder="Eigene Zeit eingeben..."
          className="w-full bg-surface-container text-on-surface text-sm font-body px-4 py-4 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 font-label text-xs uppercase" id="duration-suffix">
          Min
        </div>
      </div>
    </div>
  )
}
