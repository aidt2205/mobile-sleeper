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
    <div className="absolute inset-0 bg-surface/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 z-50 animate-fade-up">
      {/* Expanding ring pulses */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-48 h-48 rounded-full border border-secondary/10" style={{ animation: 'ringExpand 3s ease-out infinite' }} />
        <div className="absolute inset-0 w-48 h-48 rounded-full border border-secondary/10" style={{ animation: 'ringExpand 3s ease-out 1s infinite' }} />
        <div className="absolute inset-0 w-48 h-48 rounded-full border border-secondary/10" style={{ animation: 'ringExpand 3s ease-out 2s infinite' }} />
      </div>

      <p className="relative font-headline text-2xl font-bold text-on-surface tracking-tight">
        Noch wach?
      </p>

      <div className="relative w-28 h-28">
        {/* Glow behind ring */}
        <div className="absolute inset-0 rounded-full bg-secondary/[0.08] blur-[20px] animate-breathe" />
        <svg className="relative w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--color-surface-container-highest)"
            strokeWidth="3"
            opacity="0.4"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,185,84,0.3))' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-headline text-3xl font-bold text-on-surface tabular-nums">
          {countdown}
        </span>
      </div>

      <button
        onClick={onContinue}
        className="relative px-10 py-4 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary-container text-on-primary text-lg font-headline font-bold transition-transform duration-500 ease-out active:scale-95 animate-glow-pulse"
      >
        Ja, weiterschauen
      </button>
    </div>
  )
}
