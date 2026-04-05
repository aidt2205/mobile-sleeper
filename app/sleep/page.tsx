'use client'

import { useRouter } from 'next/navigation'

export default function SleepPage() {
  const router = useRouter()

  return (
    <main className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-surface-container-lowest">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[80px] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,19,25,0)_0%,rgba(13,14,20,1)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-6">
        <span
          className="material-symbols-outlined text-secondary/20 text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          bedtime
        </span>
        <span className="font-label text-sm tracking-widest text-on-surface/10 uppercase">
          Schlafmodus aktiv
        </span>
      </div>

      {/* Exit instruction */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center z-20">
        <p className="font-label text-xs tracking-widest text-on-surface/10 font-medium">
          Tippen zum Fortfahren
        </p>
      </div>

      {/* Full-screen tap target */}
      <button
        aria-label="Schlafmodus beenden"
        onClick={() => router.push('/')}
        className="absolute inset-0 w-full h-full cursor-none z-50 bg-transparent outline-none focus:outline-none"
      />
    </main>
  )
}
