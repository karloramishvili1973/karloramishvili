import { describe, it, expect } from 'vitest'
import React from 'react'
describe('Frontend smoke', () => {
  it('renders basic value', () => {
    expect(1 + 1).toBe(2)
  })
})

import { sum, capitalize } from '../src/utils'

describe('Frontend utils', () => {
  it('sum works', () => {
    expect(sum(2, 3)).toBe(5)
  })

  it('capitalize works', () => {
    expect(capitalize('hello')).toBe('Hello')
  })
})
