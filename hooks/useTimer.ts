import { useState, useRef, useCallback, useEffect } from 'react'

export type TimerState = 'idle' | 'running' | 'expired'

export function useTimer(minutes: number) {
  const totalSeconds = minutes * 60
  const totalSecondsRef = useRef(totalSeconds)
  totalSecondsRef.current = totalSeconds

  const [remaining, setRemaining] = useState(totalSeconds)
  const [state, setState] = useState<TimerState>('idle')
  const startEpoch = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Store tick in a ref to avoid stale closures in long-running intervals
  const tickRef = useRef<() => void>(() => {})
  const tick = useCallback(() => {
    if (startEpoch.current === null) return
    const elapsed = Math.floor((Date.now() - startEpoch.current) / 1000)
    const newRemaining = Math.max(0, totalSecondsRef.current - elapsed)
    setRemaining(newRemaining)
    if (newRemaining === 0) {
      setState('expired')
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])
  tickRef.current = tick

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state === 'running') tickRef.current()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [state])

  const start = useCallback(() => {
    // Clear any existing interval before starting to prevent double-tick leaks
    if (intervalRef.current) clearInterval(intervalRef.current)
    startEpoch.current = Date.now()
    setState('running')
    intervalRef.current = setInterval(() => tickRef.current(), 1000)
  }, [])

  const extend = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    startEpoch.current = Date.now()
    setState('running')
    setRemaining(totalSecondsRef.current)
    intervalRef.current = setInterval(() => tickRef.current(), 1000)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    startEpoch.current = null
    setState('idle')
    setRemaining(totalSecondsRef.current)
  }, [])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return { remaining, state, start, extend, reset }
}
