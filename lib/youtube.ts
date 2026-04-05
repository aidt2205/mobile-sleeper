const PATTERNS = [
  /[?&]v=([^&#]+)/,
  /youtu\.be\/([^?&#]+)/,
  /\/embed\/([^?&#]+)/,
]

export function extractVideoId(url: string): string | null {
  for (const pattern of PATTERNS) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
