import { useRef } from 'react'

export function useWakeLock() {
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  const request = async () => {
    try {
      if (!('wakeLock' in navigator)) return
      sentinelRef.current = await navigator.wakeLock.request('screen')
    } catch {
      // Low battery or policy rejection — timer still works, screen may dim
    }
  }

  const release = async () => {
    try {
      if (sentinelRef.current) {
        await sentinelRef.current.release()
        sentinelRef.current = null
      }
    } catch {
      // Already released
    }
  }

  return { request, release }
}
