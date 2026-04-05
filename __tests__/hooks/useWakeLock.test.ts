import { renderHook, act } from '@testing-library/react'
import { useWakeLock } from '@/hooks/useWakeLock'

const mockRelease = jest.fn().mockResolvedValue(undefined)
const mockRequest = jest.fn().mockResolvedValue({ release: mockRelease })

beforeEach(() => {
  jest.clearAllMocks()
  Object.defineProperty(navigator, 'wakeLock', {
    value: { request: mockRequest },
    configurable: true,
  })
})

describe('useWakeLock', () => {
  it('calls navigator.wakeLock.request on request()', async () => {
    const { result } = renderHook(() => useWakeLock())
    await act(async () => { await result.current.request() })
    expect(mockRequest).toHaveBeenCalledWith('screen')
  })

  it('calls release() on release()', async () => {
    const { result } = renderHook(() => useWakeLock())
    await act(async () => { await result.current.request() })
    await act(async () => { await result.current.release() })
    expect(mockRelease).toHaveBeenCalled()
  })

  it('does not throw when wakeLock is unavailable', async () => {
    Object.defineProperty(navigator, 'wakeLock', {
      value: undefined,
      configurable: true,
    })
    const { result } = renderHook(() => useWakeLock())
    await expect(act(async () => { await result.current.request() })).resolves.not.toThrow()
  })

  it('does not throw when request() rejects', async () => {
    mockRequest.mockRejectedValueOnce(new Error('NotAllowedError'))
    const { result } = renderHook(() => useWakeLock())
    await expect(act(async () => { await result.current.request() })).resolves.not.toThrow()
  })
})
