'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { buildShortcutLink } from '@/lib/shortcuts'

// Replace with real iCloud link after creating the Shortcut on your iPhone
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
          <p className="text-5xl">⏱️</p>
          <h2 className="text-2xl font-semibold">Sleep Timer</h2>
          <p className="text-zinc-400 text-sm">{minutes} Min · Helligkeit 0% · Do Not Disturb</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={handleTrigger}
            className="py-5 rounded-full bg-white text-black text-xl font-semibold"
          >
            Shortcut starten
          </button>
          <p className="text-zinc-600 text-xs text-center">
            Wechsle danach zu Netflix, YouTube oder einer anderen App
          </p>
          <div className="w-full h-px bg-zinc-800" />
          <button
            onClick={handleWakeUp}
            className="py-4 rounded-full bg-zinc-800 text-white text-lg font-medium"
          >
            🌅 Aufwachen
          </button>
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 text-sm">
          ← Zurück
        </button>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-dvh px-6 py-12 gap-8">
      <button onClick={() => router.push('/')} className="text-zinc-400 text-sm self-start">
        ← Zurück
      </button>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Einmalige Einrichtung</h2>
        <p className="text-zinc-400 text-sm">
          Installiere beide Shortcuts — Schlafen und Aufwachen. Danach läuft alles automatisch.
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-auto">
        <a
          href={ICLOUD_SHORTCUT_URL}
          className="block py-5 rounded-full bg-white text-black text-xl font-semibold text-center"
        >
          🌙 SleepTimer installieren
        </a>
        <a
          href={ICLOUD_SHORTCUT_OFF_URL}
          className="block py-4 rounded-full bg-zinc-800 text-white text-lg font-medium text-center"
        >
          🌅 SleepTimerOff installieren
        </a>
        <button
          onClick={() => setSetupDone(true)}
          className="py-4 text-zinc-500 text-sm"
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
