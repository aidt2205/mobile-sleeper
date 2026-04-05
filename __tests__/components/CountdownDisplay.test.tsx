import { render, screen } from '@testing-library/react'
import { CountdownDisplay } from '@/components/CountdownDisplay'

describe('CountdownDisplay', () => {
  it('formats seconds into MM:SS', () => {
    render(<CountdownDisplay seconds={1800} />)
    expect(screen.getByText('30:00')).toBeInTheDocument()
  })

  it('formats single-digit seconds with leading zero', () => {
    render(<CountdownDisplay seconds={65} />)
    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  it('shows 00:00 at zero', () => {
    render(<CountdownDisplay seconds={0} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('formats 90 minutes correctly', () => {
    render(<CountdownDisplay seconds={5400} />)
    expect(screen.getByText('90:00')).toBeInTheDocument()
  })
})
