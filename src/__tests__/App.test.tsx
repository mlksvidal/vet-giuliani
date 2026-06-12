import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders main content landmark', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders hero section', () => {
    render(<App />)
    expect(screen.getByRole('region', { name: /inicio/i })).toBeInTheDocument()
  })
})
