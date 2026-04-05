import { useState, useRef, useCallback, useEffect } from 'react'

export type TimerState = 'idle' | 'running' | 'expired'

export function useTimer(minutes: number) {
  const totalSeconds = minutes * 60
  const [remaining, setRemaining] = useState(totalSeconds)
  const [state, setState] = useState<TimerState>('idle')
  const startEpoch = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tick = useCallback(() => {
    if (startEpoch.current === null) return
    const elapsed = Math.floor((Date.now() - startEpoch.current) / 1000)
    const newRemaining = Math.max(0, totalSeconds - elapsed)
    setRemaining(newRemaining)
    if (newRemaining === 0) {
      setState('expired')
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [totalSeconds])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state === 'running') tick()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [state, tick])

  const start = useCallback(() => {
    startEpoch.current = Date.now()
    setState('running')
    setRemaining(totalSeconds)
    intervalRef.current = setInterval(tick, 1000)
  }, [tick, totalSeconds])

  const extend = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    startEpoch.current = Date.now()
    setState('running')
    setRemaining(totalSeconds)
    intervalRef.current = setInterval(tick, 1000)
  }, [tick, totalSeconds])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    startEpoch.current = null
    setState('idle')
    setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return { remaining, state, start, extend, reset }
}
