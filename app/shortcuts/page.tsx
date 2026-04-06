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
        <main className="w-full max-w-md mx-auto px-6 pt-24 pb-32 flex flex-col gap-6">
          {/* Config Card — Stitch-Style */}
          <section className="bg-surface-container rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl">auto_awesome</span>
            </div>
            <div className="relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary mb-1 block font-label">
                Aktuelle Konfig
              </span>
              <h3 className="text-xl font-headline font-bold text-on-surface">Sleep Timer</h3>
              <p className="text-sm text-on-surface-variant font-body">
                {minutes} Min · Helligkeit 0% · Do Not Disturb
              </p>
            </div>
          </section>

          {/* Actions — Row-Buttons */}
          <section className="flex flex-col gap-3">
            <button
              onClick={handleTrigger}
              className="w-full flex items-center justify-between px-6 py-5 rounded-xl bg-surface-container-high border-l-4 border-secondary hover:bg-surface-container-highest transition-colors duration-500 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_circle
                </span>
                <span className="font-headline font-bold text-lg text-on-surface">Shortcut starten</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>
            <p className="text-on-surface-variant/60 text-xs text-center font-label">
              Wechsle danach zu Netflix, YouTube oder einer anderen App
            </p>
            <button
              onClick={handleWakeUp}
              className="w-full flex items-center justify-between px-6 py-5 rounded-xl bg-surface-container-lowest border border-outline-variant/10 hover:bg-surface-container-low transition-colors duration-500 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">wb_sunny</span>
                <span className="font-headline font-semibold text-on-surface-variant">Aufwachen</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40">chevron_right</span>
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
      <main className="w-full max-w-md mx-auto px-6 pt-24 pb-32 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-headline font-bold text-on-surface">
            Einmalige Einrichtung
          </h2>
          <p className="text-on-surface-variant text-sm font-body leading-relaxed">
            Installiere beide Shortcuts — Schlafen und Aufwachen. Danach läuft alles automatisch.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <a
            href={ICLOUD_SHORTCUT_URL}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-colors duration-500"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">timer</span>
            </div>
            <div className="text-center">
              <span className="block font-headline font-bold text-lg">SleepTimer</span>
              <span className="text-xs text-on-surface-variant">Installieren</span>
            </div>
          </a>
          <a
            href={ICLOUD_SHORTCUT_OFF_URL}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-colors duration-500"
          >
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-3xl">timer_off</span>
            </div>
            <div className="text-center">
              <span className="block font-headline font-bold text-lg">SleepTimerOff</span>
              <span className="text-xs text-on-surface-variant">Installieren</span>
            </div>
          </a>
        </div>
        <button
          onClick={() => setSetupDone(true)}
          className="py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold transition-transform duration-500 active:scale-95"
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
