'use client'

import { useRouter } from 'next/navigation'

export default function SleepPage() {
  const router = useRouter()

  return (
    <main
      className="bg-black min-h-dvh flex flex-col items-center justify-end pb-12 cursor-pointer"
      onClick={() => router.push('/')}
    >
      <p className="text-zinc-800 text-sm select-none">Tippen zum Fortfahren</p>
    </main>
  )
}
