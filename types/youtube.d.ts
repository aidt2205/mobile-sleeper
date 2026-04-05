interface YTPlayerEvent {
  target: YTPlayer
}

interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  destroy(): void
}

interface YTPlayerOptions {
  videoId: string
  playerVars?: {
    autoplay?: 0 | 1
    controls?: 0 | 1
    rel?: 0 | 1
    modestbranding?: 0 | 1
    playsinline?: 0 | 1
  }
  events?: {
    onReady?: (event: YTPlayerEvent) => void
  }
}

declare namespace YT {
  class Player {
    constructor(elementId: string, options: YTPlayerOptions)
    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    destroy(): void
  }
}

interface Window {
  YT: typeof YT
  onYouTubeIframeAPIReady: () => void
}
