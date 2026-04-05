'use client'

import { useEffect, useRef } from 'react'

interface YouTubePlayerProps {
  videoId: string
  playerRef: React.MutableRefObject<YTPlayer | null>
  onReady?: () => void
}

export function YouTubePlayer({ videoId, playerRef, onReady }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!videoId || !containerRef.current) return

    const initPlayer = () => {
      if (!containerRef.current) return
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      const div = document.createElement('div')
      div.id = `yt-player-${videoId}`
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(div)

      playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
        videoId,
        playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: { onReady: () => onReady?.() },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [videoId]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className="w-full aspect-video bg-black" />
}
