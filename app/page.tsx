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
    if (mode === 'youtube') {
      router.push(`/player?minutes=${minutes}`)
    } else {
      router.push(`/shortcuts?minutes=${minutes}`)
    }
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-dvh px-6 py-12 gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl">🌙</h1>
        <h2 className="text-2xl font-semibold text-white">Sleeper</h2>
        <p className="text-zinc-500 text-sm">Sleep Timer</p>
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
        className="w-full max-w-sm py-5 rounded-full bg-white text-black text-xl font-semibold active:scale-95 transition-transform"
      >
        Timer starten
      </button>
    </main>
  )
}
