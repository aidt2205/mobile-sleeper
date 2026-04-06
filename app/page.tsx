'use client'

import { useRouter } from 'next/navigation'
import { ModeToggle, Mode } from '@/components/ModeToggle'
import { TimerPicker } from '@/components/TimerPicker'
import { AutoLockBanner } from '@/components/AutoLockBanner'
import { AppBar, BottomNav } from '@/components/ui'
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
    <>
      <AppBar />
      <main className="w-full max-w-md mx-auto px-6 pt-24 pb-32 flex flex-col gap-8">
        {!bannerDismissed && (
          <AutoLockBanner onDismiss={() => setBannerDismissed(true)} />
        )}
        <ModeToggle value={mode} onChange={setMode} />
        <TimerPicker value={minutes} onChange={setMinutes} />

        <button
          onClick={handleStart}
          className="w-full py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-xl font-headline font-bold active:scale-95 transition-transform duration-500"
        >
          Timer starten
        </button>
      </main>
      <BottomNav />
    </>
  )
}
