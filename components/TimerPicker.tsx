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
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            aria-pressed={value === preset}
            onClick={() => onChange(preset)}
            className={`py-4 rounded-2xl text-xl font-semibold transition-colors ${
              value === preset ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-zinc-500 text-sm flex-1">Eigene Zeit (Min)</span>
        <input
          type="number"
          min={1}
          max={180}
          value={value}
          onChange={handleCustomChange}
          className="bg-zinc-900 text-white text-xl text-center w-20 py-3 rounded-2xl border border-zinc-800 focus:outline-none focus:border-zinc-600"
        />
      </div>
    </div>
  )
}
