import { render, screen, act, fireEvent } from '@testing-library/react'
import { WakeCheckOverlay } from '@/components/WakeCheckOverlay'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

jest.mock('@/lib/audio', () => ({ playBeep: jest.fn() }))

describe('WakeCheckOverlay', () => {
  it('shows "Noch wach?" text', () => {
    render(<WakeCheckOverlay onContinue={jest.fn()} onSleep={jest.fn()} />)
    expect(screen.getByText(/Noch wach/i)).toBeInTheDocument()
  })

  it('shows 60 second countdown initially', () => {
    render(<WakeCheckOverlay onContinue={jest.fn()} onSleep={jest.fn()} />)
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('counts down over time', () => {
    render(<WakeCheckOverlay onContinue={jest.fn()} onSleep={jest.fn()} />)
    act(() => { jest.advanceTimersByTime(5000) })
    expect(screen.getByText('55')).toBeInTheDocument()
  })

  it('calls onSleep after 60 seconds', () => {
    const onSleep = jest.fn()
    render(<WakeCheckOverlay onContinue={jest.fn()} onSleep={onSleep} />)
    act(() => { jest.advanceTimersByTime(60000) })
    expect(onSleep).toHaveBeenCalled()
  })

  it('calls onContinue when tapped', () => {
    const onContinue = jest.fn()
    render(<WakeCheckOverlay onContinue={onContinue} onSleep={jest.fn()} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onContinue).toHaveBeenCalled()
  })
})
