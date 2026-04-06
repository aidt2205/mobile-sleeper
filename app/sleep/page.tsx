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

export default function SleepPage() {
  const router = useRouter()
  const time = useCurrentTime()

  return (
    <main className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-surface-container-lowest">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[80px] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,19,25,0)_0%,rgba(13,14,20,1)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        <span className="font-headline text-[120px] font-extrabold tracking-tighter text-on-surface/5 leading-none select-none">
          {time}
        </span>
        <span className="font-label text-sm tracking-widest text-on-surface/10 uppercase mt-4 select-none">
          Schlafmodus aktiv
        </span>
      </div>

      {/* Exit instruction */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center z-20">
        <p className="font-label text-xs tracking-widest text-on-surface/10 font-medium select-none">
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
