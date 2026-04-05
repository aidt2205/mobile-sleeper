import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('returns initial value when key is not set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    act(() => result.current[1]('new-value'))
    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe('"new-value"')
  })

  it('reads existing value from localStorage on mount', () => {
    localStorage.setItem('test-key', '"stored"')
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('works with boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('bool-key', false))
    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)
  })

  it('works with number values', () => {
    const { result } = renderHook(() => useLocalStorage('num-key', 30))
    act(() => result.current[1](45))
    expect(result.current[0]).toBe(45)
  })
})
