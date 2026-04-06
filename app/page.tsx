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
      <main className="w-full max-w-md mx-auto px-6 pt-24 pb-32 min-h-dvh flex flex-col gap-6">
        {!bannerDismissed && (
          <AutoLockBanner onDismiss={() => setBannerDismissed(true)} />
        )}

        {/* Mode Selection Card */}
        <section className="bg-surface-container-high rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="font-headline text-sm font-semibold tracking-wide uppercase text-on-surface-variant">
            Modus wählen
          </h2>
          <ModeToggle value={mode} onChange={setMode} />
        </section>

        {/* Timer Card */}
        <section className="bg-surface-container-high rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface">
              {minutes}
            </span>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              Minuten
            </span>
          </div>
          <TimerPicker value={minutes} onChange={setMinutes} />
        </section>

        {/* Start Button */}
        <section className="mt-auto pt-4">
          <button
            onClick={handleStart}
            className="w-full py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-headline font-bold tracking-wide shadow-xl active:scale-[0.98] transition-transform duration-500"
          >
            Timer starten
          </button>
        </section>
      </main>
      <BottomNav />
    </>
  )
}
