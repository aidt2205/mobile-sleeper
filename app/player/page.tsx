'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { YouTubePlayer } from '@/components/YouTubePlayer'
import { CountdownDisplay } from '@/components/CountdownDisplay'
import { WakeCheckOverlay } from '@/components/WakeCheckOverlay'
import { AppBar, BottomNav } from '@/components/ui'
import { useTimer } from '@/hooks/useTimer'
import { useWakeLock } from '@/hooks/useWakeLock'
import { extractVideoId } from '@/lib/youtube'

function PlayerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const minutes = parseInt(searchParams.get('minutes') ?? '30', 10)

  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [urlError, setUrlError] = useState('')
  const [showWakeCheck, setShowWakeCheck] = useState(false)

  const playerRef = useRef<YTPlayer | null>(null)
  const { remaining, state, start, extend, reset } = useTimer(minutes)
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()

  const handlePlayerReady = () => {
    start()
    requestWakeLock()
  }

  useEffect(() => {
    if (state === 'expired') setShowWakeCheck(true)
  }, [state])

  const handleWakeContinue = () => {
    setShowWakeCheck(false)
    extend()
    requestWakeLock()
  }

  const handleWakeSleep = () => {
    setShowWakeCheck(false)
    releaseWakeLock()
    playerRef.current?.stopVideo()
    router.push('/sleep')
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = extractVideoId(url)
    if (!id) {
      setUrlError('Kein gültiger YouTube-Link')
      return
    }
    setUrlError('')
    setVideoId(id)
  }

  return (
    <>
      <AppBar
        leftAction={
          <button
            onClick={() => { releaseWakeLock(); reset(); router.push('/') }}
            aria-label="Zurück"
            className="text-on-surface-variant hover:text-on-surface transition-colors duration-500"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        }
        rightAction={<CountdownDisplay seconds={remaining} />}
      />

      <main className="flex flex-col min-h-dvh bg-surface relative pt-16 pb-28">
        {!videoId && (
          <div className="flex flex-col items-center justify-center flex-1 px-6 gap-4">
            <p className="text-on-surface-variant text-sm text-center font-label">
              YouTube-Link einfügen
            </p>
            <form onSubmit={handleUrlSubmit} className="flex flex-col gap-3 w-full max-w-sm">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="bg-surface-container-lowest text-on-surface px-4 py-4 rounded-2xl text-base border-none focus:outline-none focus:ring-2 focus:ring-primary/20 w-full font-body placeholder:text-on-surface-variant/40"
                autoFocus
              />
              {urlError && <p className="text-error text-sm">{urlError}</p>}
              <button
                type="submit"
                className="py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg transition-transform duration-500 active:scale-95"
              >
                Video laden
              </button>
            </form>
          </div>
        )}

        {videoId && (
          <div className="flex-1 flex flex-col">
            <YouTubePlayer videoId={videoId} playerRef={playerRef} onReady={handlePlayerReady} />
          </div>
        )}

        {showWakeCheck && (
          <WakeCheckOverlay onContinue={handleWakeContinue} onSleep={handleWakeSleep} />
        )}
      </main>
      <BottomNav />
    </>
  )
}

export default function PlayerPage() {
  return (
    <Suspense>
      <PlayerContent />
    </Suspense>
  )
}
