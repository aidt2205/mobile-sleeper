import { render, screen, fireEvent } from '@testing-library/react'
import { TimerPicker } from '@/components/TimerPicker'

describe('TimerPicker', () => {
  it('renders all four presets', () => {
    render(<TimerPicker value={30} onChange={jest.fn()} />)
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('marks active preset', () => {
    render(<TimerPicker value={30} onChange={jest.fn()} />)
    const btn = screen.getByText('30').closest('button')
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange with preset value', () => {
    const onChange = jest.fn()
    render(<TimerPicker value={30} onChange={onChange} />)
    fireEvent.click(screen.getByText('15'))
    expect(onChange).toHaveBeenCalledWith(15)
  })

  it('calls onChange when custom input changes', () => {
    const onChange = jest.fn()
    render(<TimerPicker value={30} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '90' } })
    expect(onChange).toHaveBeenCalledWith(90)
  })

  it('clamps custom input to 1-180 range', () => {
    const onChange = jest.fn()
    render(<TimerPicker value={30} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '200' } })
    expect(onChange).toHaveBeenCalledWith(180)
  })
})
