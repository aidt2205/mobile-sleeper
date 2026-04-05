import { render, screen, fireEvent } from '@testing-library/react'
import { ModeToggle } from '@/components/ModeToggle'

describe('ModeToggle', () => {
  it('renders both mode labels', () => {
    render(<ModeToggle value="youtube" onChange={jest.fn()} />)
    expect(screen.getByText('YouTube')).toBeInTheDocument()
    expect(screen.getByText('Universal')).toBeInTheDocument()
  })

  it('highlights the active mode', () => {
    render(<ModeToggle value="youtube" onChange={jest.fn()} />)
    const youtubeBtn = screen.getByText('YouTube').closest('button')
    expect(youtubeBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange when other mode is tapped', () => {
    const onChange = jest.fn()
    render(<ModeToggle value="youtube" onChange={onChange} />)
    fireEvent.click(screen.getByText('Universal'))
    expect(onChange).toHaveBeenCalledWith('universal')
  })
})
