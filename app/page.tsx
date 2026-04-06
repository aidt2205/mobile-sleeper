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

      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px] animate-drift" />
        <div className="absolute -bottom-48 -left-24 w-[350px] h-[350px] rounded-full bg-secondary/[0.03] blur-[120px] animate-drift-reverse" />
      </div>

      <main className="relative z-10 w-full max-w-md mx-auto px-6 pt-24 pb-32 min-h-dvh flex flex-col gap-6">
        {!bannerDismissed && (
          <div className="animate-fade-up">
            <AutoLockBanner onDismiss={() => setBannerDismissed(true)} />
          </div>
        )}

        {/* Mode Selection Card */}
        <section className="bg-surface-container-high rounded-3xl p-5 flex flex-col gap-3 animate-fade-up-1">
          <h2 className="font-headline text-[11px] font-semibold tracking-[0.2em] uppercase text-on-surface-variant/70 pl-1">
            Modus
          </h2>
          <ModeToggle value={mode} onChange={setMode} />
        </section>

        {/* Timer Card — Hero Element */}
        <section className="bg-surface-container-high rounded-3xl p-8 flex flex-col items-center gap-8 animate-fade-up-2">
          {/* Breathing Timer Display */}
          <div className="relative flex flex-col items-center">
            {/* Ambient glow behind number */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/[0.08] blur-[60px] animate-breathe" />
            <span className="relative font-headline text-7xl font-extrabold tracking-tighter text-on-surface leading-none animate-breathe">
              {minutes}
            </span>
            <span className="relative font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 mt-3">
              Minuten
            </span>
          </div>
          <TimerPicker value={minutes} onChange={setMinutes} />
        </section>

        {/* Start Button — Glowing CTA */}
        <section className="mt-auto pt-4 animate-fade-up-3">
          <button
            onClick={handleStart}
            className="relative w-full py-5 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary-container text-on-primary text-lg font-headline font-bold tracking-wide active:scale-[0.97] transition-transform duration-500 ease-out animate-glow-pulse"
          >
            Timer starten
          </button>
        </section>
      </main>
      <BottomNav />
    </>
  )
}
