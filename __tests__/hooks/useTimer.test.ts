import { renderHook, act } from '@testing-library/react'
import { useTimer } from '@/hooks/useTimer'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

describe('useTimer', () => {
  it('starts in idle state with full time remaining', () => {
    const { result } = renderHook(() => useTimer(1))
    expect(result.current.state).toBe('idle')
    expect(result.current.remaining).toBe(60)
  })

  it('counts down after start()', () => {
    const { result } = renderHook(() => useTimer(1))
    act(() => { result.current.start() })
    act(() => { jest.advanceTimersByTime(10000) })
    expect(result.current.remaining).toBe(50)
    expect(result.current.state).toBe('running')
  })

  it('reaches expired state at 0', () => {
    const { result } = renderHook(() => useTimer(1))
    act(() => { result.current.start() })
    act(() => { jest.advanceTimersByTime(60000) })
    expect(result.current.remaining).toBe(0)
    expect(result.current.state).toBe('expired')
  })

  it('extend() restarts timer for original duration', () => {
    const { result } = renderHook(() => useTimer(1))
    act(() => { result.current.start() })
    act(() => { jest.advanceTimersByTime(50000) })
    expect(result.current.remaining).toBe(10)
    act(() => { result.current.extend() })
    expect(result.current.remaining).toBe(60)
    expect(result.current.state).toBe('running')
  })

  it('reset() returns to idle with full time', () => {
    const { result } = renderHook(() => useTimer(1))
    act(() => { result.current.start() })
    act(() => { jest.advanceTimersByTime(30000) })
    act(() => { result.current.reset() })
    expect(result.current.state).toBe('idle')
    expect(result.current.remaining).toBe(60)
  })
})
