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
      <div className="flex justify-center gap-3">
        {PRESETS.map((preset) => {
          const active = value === preset
          return (
            <button
              key={preset}
              aria-pressed={active}
              onClick={() => onChange(preset)}
              className={`
                relative min-w-[52px] min-h-[44px] px-4 py-2.5 rounded-full text-sm font-label font-bold
                transition-all duration-500 ease-out active:scale-90
                ${active
                  ? 'bg-secondary/20 text-secondary shadow-[0_0_16px_rgba(255,185,84,0.15)]'
                  : 'bg-surface-container-highest/50 text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-surface-container-highest'
                }
              `}
            >
              {preset}
            </button>
          )
        })}
      </div>
      <div className="relative">
        <input
          type="number"
          min={1}
          max={180}
          value={value}
          onChange={handleCustomChange}
          aria-label="Dauer in Minuten"
          placeholder="Eigene Zeit..."
          className="w-full bg-surface-container-lowest text-on-surface text-sm font-body px-4 py-4 rounded-xl border-none focus:outline-none focus:shadow-[0_0_0_2px_rgba(186,195,255,0.15)] transition-shadow duration-500 placeholder:text-on-surface-variant/30"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-label text-[10px] uppercase tracking-widest">
          Min
        </div>
      </div>
    </div>
  )
}
