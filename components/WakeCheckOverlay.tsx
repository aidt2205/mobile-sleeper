'use client'

import { useState, useEffect, useRef } from 'react'
import { playBeep } from '@/lib/audio'

interface WakeCheckOverlayProps {
  onContinue: () => void
  onSleep: () => void
}

export function WakeCheckOverlay({ onContinue, onSleep }: WakeCheckOverlayProps) {
  const [countdown, setCountdown] = useState(60)
  const onSleepRef = useRef(onSleep)
  onSleepRef.current = onSleep

  useEffect(() => {
    playBeep()
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onSleepRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center gap-6 animate-pulse z-50">
      <p className="text-white text-3xl font-semibold">Noch wach? 🌙</p>
      <p className="text-zinc-400 text-6xl font-mono font-bold">{countdown}</p>
      <button
        onClick={onContinue}
        className="mt-4 px-10 py-4 rounded-full bg-white text-black text-lg font-semibold"
      >
        Ja, weiterschauen
      </button>
    </div>
  )
}
