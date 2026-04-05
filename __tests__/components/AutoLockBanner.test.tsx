import { render, screen, fireEvent } from '@testing-library/react'
import { AutoLockBanner } from '@/components/AutoLockBanner'

describe('AutoLockBanner', () => {
  it('renders Auto-Lock hint text', () => {
    render(<AutoLockBanner onDismiss={jest.fn()} />)
    expect(screen.getByText(/Auto-Lock/i)).toBeInTheDocument()
  })

  it('calls onDismiss when close button is tapped', () => {
    const onDismiss = jest.fn()
    render(<AutoLockBanner onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onDismiss).toHaveBeenCalled()
  })
})
