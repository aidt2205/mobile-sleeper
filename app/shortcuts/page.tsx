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
          {/* Config Card */}
          <section className="bg-surface-container rounded-2xl p-6 flex flex-col items-center gap-3">
            <span
              className="material-symbols-outlined text-4xl text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              timer
            </span>
            <h2 className="text-xl font-headline font-bold text-on-surface">Sleep Timer</h2>
            <p className="text-on-surface-variant text-sm font-label">
              {minutes} Min · Helligkeit 0% · Do Not Disturb
            </p>
          </section>

          {/* Actions */}
          <section className="flex flex-col gap-3">
            <button
              onClick={handleTrigger}
              className="w-full py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-xl font-headline font-bold transition-transform duration-500 active:scale-[0.98]"
            >
              Shortcut starten
            </button>
            <p className="text-on-surface-variant/60 text-xs text-center font-label">
              Wechsle danach zu Netflix, YouTube oder einer anderen App
            </p>
            <button
              onClick={handleWakeUp}
              className="w-full py-4 rounded-xl bg-surface-container-high text-secondary text-lg font-headline font-semibold flex items-center justify-center gap-2 transition-transform duration-500 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">wb_sunny</span>
              Aufwachen
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
