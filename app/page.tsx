'use client'

import { useRouter } from 'next/navigation'
import { ModeToggle, Mode } from '@/components/ModeToggle'
import { TimerPicker } from '@/components/TimerPicker'
import { AutoLockBanner } from '@/components/AutoLockBanner'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function HomePage() {
  const router = useRouter()
  const [mode, setMode] = useLocalStorage<Mode>('sleeper-mode', 'youtube')
  const [minutes, setMinutes] = useLocalStorage<number>('sleeper-minutes', 30)
  const [bannerDismissed, setBannerDismissed] = useLocalStorage<boolean>('sleeper-banner-dismissed', false)

  const handleStart = () => {
    const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 30
    if (mode === 'youtube') {
      router.push(`/player?minutes=${safeMinutes}`)
    } else {
      router.push(`/shortcuts?minutes=${safeMinutes}`)
    }
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-dvh px-6 py-12 gap-8">
      <div className="flex flex-col items-center gap-2">
        <span
          className="material-symbols-outlined text-4xl text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          bedtime
        </span>
        <h2 className="text-2xl font-headline font-bold tracking-tight text-primary">
          Sleeper
        </h2>
        <p className="text-on-surface-variant text-sm font-label">Sleep Timer</p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        {!bannerDismissed && (
          <AutoLockBanner onDismiss={() => setBannerDismissed(true)} />
        )}
        <ModeToggle value={mode} onChange={setMode} />
        <TimerPicker value={minutes} onChange={setMinutes} />
      </div>

      <button
        onClick={handleStart}
        className="w-full max-w-sm py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-xl font-headline font-bold active:scale-95 transition-transform duration-500"
      >
        Timer starten
      </button>
    </main>
  )
}
