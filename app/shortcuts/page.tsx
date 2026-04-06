'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { buildShortcutLink } from '@/lib/shortcuts'
import { AppBar, BottomNav } from '@/components/ui'

const ICLOUD_SHORTCUT_URL = 'https://www.icloud.com/shortcuts/e0ab8a9e48014166bd0e8891df09bc29'
const ICLOUD_SHORTCUT_OFF_URL = 'https://www.icloud.com/shortcuts/62c4a7bda90f46008e21a316c55f23a6'

function ShortcutsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const minutes = parseInt(searchParams.get('minutes') ?? '30', 10)
  const [setupDone, setSetupDone] = useLocalStorage<boolean>('sleeper-shortcut-setup', false)

  const handleTrigger = () => {
    window.location.href = buildShortcutLink(minutes)
  }

  const handleWakeUp = () => {
    window.location.href = 'shortcuts://run-shortcut?name=SleepTimerOff'
  }

  if (setupDone) {
    return (
      <>
        <AppBar />
        {/* Ambient Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 w-[350px] h-[350px] rounded-full bg-secondary/[0.03] blur-[100px] animate-drift-reverse" />
        </div>

        <main className="relative z-10 w-full max-w-md mx-auto px-6 pt-24 pb-32 flex flex-col gap-6">
          {/* Config Card */}
          <section className="bg-surface-container-high  rounded-3xl p-6 relative overflow-hidden animate-fade-up">
            <div className="absolute top-0 right-0 p-4 opacity-[0.06]">
              <span className="material-symbols-outlined text-8xl text-primary">auto_awesome</span>
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary/80 mb-1.5 block font-label">
                Aktuelle Konfig
              </span>
              <h3 className="text-xl font-headline font-bold text-on-surface tracking-tight">Sleep Timer</h3>
              <p className="text-sm text-on-surface-variant/60 font-body mt-1">
                {minutes} Min · Helligkeit 0% · Do Not Disturb
              </p>
            </div>
          </section>

          {/* Actions */}
          <section className="flex flex-col gap-3 animate-fade-up-1">
            <button
              onClick={handleTrigger}
              className="w-full flex items-center justify-between px-6 py-5 rounded-2xl bg-surface-container-high  hover:bg-surface-container-highest transition-all duration-500 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_circle
                  </span>
                </div>
                <span className="font-headline font-bold text-on-surface">Shortcut starten</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-on-surface-variant/60 transition-colors duration-500">arrow_forward</span>
            </button>
            <p className="text-on-surface-variant/30 text-[10px] text-center font-label tracking-wide">
              Wechsle danach zu Netflix, YouTube oder einer anderen App
            </p>
            <button
              onClick={handleWakeUp}
              className="w-full flex items-center justify-between px-6 py-5 rounded-2xl bg-surface-container-lowest  hover:bg-surface-container-low transition-all duration-500 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">wb_sunny</span>
                </div>
                <span className="font-headline font-semibold text-on-surface-variant">Aufwachen</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/20 group-hover:text-on-surface-variant/40 transition-colors duration-500">arrow_forward</span>
            </button>
          </section>
        </main>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <AppBar />
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -bottom-48 -right-24 w-[350px] h-[350px] rounded-full bg-primary/[0.04] blur-[120px] animate-drift" />
      </div>

      <main className="relative z-10 w-full max-w-md mx-auto px-6 pt-24 pb-32 flex flex-col gap-8">
        <div className="flex flex-col gap-3 animate-fade-up">
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">
            Einmalige Einrichtung
          </h2>
          <p className="text-on-surface-variant/60 text-sm font-body leading-relaxed">
            Installiere beide Shortcuts — Schlafen und Aufwachen. Danach läuft alles automatisch.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 animate-fade-up-1">
          <a
            href={ICLOUD_SHORTCUT_URL}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-surface-container-high  hover:bg-surface-container-highest transition-all duration-500 active:scale-[0.97] group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-500">
              <span className="material-symbols-outlined text-primary text-3xl">timer</span>
            </div>
            <div className="text-center">
              <span className="block font-headline font-bold text-lg tracking-tight">SleepTimer</span>
              <span className="text-[10px] text-on-surface-variant/40 tracking-wide uppercase">Installieren</span>
            </div>
          </a>
          <a
            href={ICLOUD_SHORTCUT_OFF_URL}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-surface-container-high  hover:bg-surface-container-highest transition-all duration-500 active:scale-[0.97] group"
          >
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/15 transition-colors duration-500">
              <span className="material-symbols-outlined text-secondary text-3xl">timer_off</span>
            </div>
            <div className="text-center">
              <span className="block font-headline font-bold text-lg tracking-tight">SleepTimerOff</span>
              <span className="text-[10px] text-on-surface-variant/40 tracking-wide uppercase">Installieren</span>
            </div>
          </a>
        </div>
        <button
          onClick={() => setSetupDone(true)}
          className="py-4 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary-container text-on-primary font-headline font-bold transition-transform duration-500 ease-out active:scale-95 animate-glow-pulse animate-fade-up-2"
        >
          Beide installiert → Weiter
        </button>
      </main>
      <BottomNav />
    </>
  )
}

export default function ShortcutsPage() {
  return (
    <Suspense>
      <ShortcutsContent />
    </Suspense>
  )
}
