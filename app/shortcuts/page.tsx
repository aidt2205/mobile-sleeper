'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { buildShortcutLink } from '@/lib/shortcuts'

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
      <main className="flex flex-col items-center justify-center min-h-dvh px-6 gap-8">
        <div className="flex flex-col items-center gap-2">
          <span
            className="material-symbols-outlined text-5xl text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Sleep Timer</h2>
          <p className="text-on-surface-variant text-sm font-label">
            {minutes} Min · Helligkeit 0% · Do Not Disturb
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={handleTrigger}
            className="py-5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-xl font-headline font-bold transition-transform duration-500 active:scale-95"
          >
            Shortcut starten
          </button>
          <p className="text-on-surface-variant/60 text-xs text-center font-label">
            Wechsle danach zu Netflix, YouTube oder einer anderen App
          </p>
          <button
            onClick={handleWakeUp}
            className="py-4 rounded-xl bg-surface-container-high text-secondary text-lg font-headline font-semibold flex items-center justify-center gap-2 transition-transform duration-500 active:scale-95"
          >
            <span className="material-symbols-outlined">wb_sunny</span>
            Aufwachen
          </button>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-on-surface-variant text-sm font-label flex items-center gap-1 hover:text-on-surface transition-colors duration-500"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Zurück
        </button>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-dvh px-6 py-12 gap-8">
      <button
        onClick={() => router.push('/')}
        className="text-on-surface-variant text-sm self-start font-label flex items-center gap-1 hover:text-on-surface transition-colors duration-500"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Zurück
      </button>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-headline font-bold text-on-surface">
          Einmalige Einrichtung
        </h2>
        <p className="text-on-surface-variant text-sm font-body leading-relaxed">
          Installiere beide Shortcuts — Schlafen und Aufwachen. Danach läuft alles automatisch.
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-auto">
        <a
          href={ICLOUD_SHORTCUT_URL}
          className="flex items-center justify-center gap-3 py-5 rounded-xl bg-surface-container-low text-on-surface text-xl font-headline font-bold text-center hover:bg-surface-container-high transition-colors duration-500"
        >
          <span className="material-symbols-outlined text-primary">timer</span>
          SleepTimer installieren
        </a>
        <a
          href={ICLOUD_SHORTCUT_OFF_URL}
          className="flex items-center justify-center gap-3 py-4 rounded-xl bg-surface-container-low text-on-surface text-lg font-headline font-semibold text-center hover:bg-surface-container-high transition-colors duration-500"
        >
          <span className="material-symbols-outlined text-secondary">timer_off</span>
          SleepTimerOff installieren
        </a>
        <button
          onClick={() => setSetupDone(true)}
          className="py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold transition-transform duration-500 active:scale-95"
        >
          Beide installiert → Weiter
        </button>
      </div>
    </main>
  )
}

export default function ShortcutsPage() {
  return (
    <Suspense>
      <ShortcutsContent />
    </Suspense>
  )
}
