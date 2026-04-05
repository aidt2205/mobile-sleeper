'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { buildShortcutLink } from '@/lib/shortcuts'

// Replace with real iCloud link after creating the Shortcut on your iPhone
const ICLOUD_SHORTCUT_URL = 'https://www.icloud.com/shortcuts/REPLACE_ME'

const STEPS = [
  'Tippe auf "Shortcut installieren" unten',
  'Öffne die Kurzbefehle-App und tippe auf "Hinzufügen"',
  'Fertig — der Shortcut "SleepTimer" ist bereit',
]

function ShortcutsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const minutes = parseInt(searchParams.get('minutes') ?? '30', 10)
  const [setupDone, setSetupDone] = useLocalStorage<boolean>('sleeper-shortcut-setup', false)

  const handleTrigger = () => {
    window.location.href = buildShortcutLink(minutes)
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
          Installiere den iOS Shortcut, der Helligkeit auf 0% setzt und Do Not Disturb aktiviert.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-start gap-4">
            <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {i + 1}
            </span>
            <p className="text-zinc-300 text-base pt-1">{step}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 mt-auto">
        <a
          href={ICLOUD_SHORTCUT_URL}
          className="block py-5 rounded-full bg-white text-black text-xl font-semibold text-center"
        >
          Shortcut installieren
        </a>
        <button
          onClick={() => setSetupDone(true)}
          className="py-4 text-zinc-500 text-sm"
        >
          Bereits installiert → Weiter
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
