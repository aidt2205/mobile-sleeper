'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function useCurrentTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])
  return time
}

function StarField() {
  const [stars] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 3,
    }))
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-on-surface/20"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function SleepPage() {
  const router = useRouter()
  const time = useCurrentTime()

  return (
    <main className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-surface-container-lowest">
      {/* Star field */}
      <StarField />

      {/* Deep ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] opacity-[0.025] animate-breathe" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-secondary rounded-full blur-[100px] opacity-[0.015] animate-drift-reverse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,19,25,0)_0%,rgba(13,14,20,1)_80%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        <span className="font-headline text-[110px] font-extrabold tracking-tighter text-on-surface/[0.06] leading-none select-none animate-breathe">
          {time}
        </span>
        <div className="flex items-center gap-3 mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 animate-breathe" />
          <span className="font-label text-[10px] tracking-[0.3em] text-on-surface-variant/20 uppercase select-none">
            Schlafmodus aktiv
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 animate-breathe" />
        </div>
      </div>

      {/* Exit instruction */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center z-20">
        <p className="font-label text-[10px] tracking-[0.2em] text-on-surface-variant/10 font-medium select-none">
          Tippen zum Fortfahren
        </p>
      </div>

      {/* Full-screen tap target */}
      <button
        aria-label="Schlafmodus beenden"
        onClick={() => router.push('/')}
        className="absolute inset-0 w-full h-full cursor-none z-50 bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
    </main>
  )
}
