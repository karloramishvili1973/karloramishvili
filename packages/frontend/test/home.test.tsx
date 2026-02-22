import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'
import { describe, it, expect } from 'vitest'

describe('Home page', () => {
  it('renders title', () => {
    render(<Home />)
    expect(screen.getByText(/Enterprise DAO — Frontend/i)).toBeTruthy()
  })
})
