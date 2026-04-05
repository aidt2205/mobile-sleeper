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

  const progress = ((60 - countdown) / 60) * 100

  return (
    <div className="absolute inset-0 bg-surface/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 z-50">
      <p className="font-headline text-2xl font-bold text-on-surface">
        Noch wach?
      </p>

      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--color-surface-container-highest)"
            strokeWidth="4"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-headline text-2xl font-bold text-on-surface">
          {countdown}
        </span>
      </div>

      <button
        onClick={onContinue}
        className="px-10 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-headline font-bold transition-transform duration-500 active:scale-95"
      >
        Ja, weiterschauen
      </button>
    </div>
  )
}
