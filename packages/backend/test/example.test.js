import { describe, it, expect } from 'vitest'
describe('Backend smoke', () => {
  it('basic equality', () => {
    expect(3 * 7).toBe(21)
  })
})

import { mul, isEven } from '../src/utils'

describe('Backend utils', () => {
  it('mul works', () => {
    expect(mul(4, 5)).toBe(20)
  })

  it('isEven works', () => {
    expect(isEven(6)).toBe(true)
    expect(isEven(7)).toBe(false)
  })
})

describe('Backend utils edge cases', () => {
  it('mul negatives', () => {
    expect(mul(-3, 5)).toBe(-15)
    expect(mul(-3, -4)).toBe(12)
  })

  it('isEven zero', () => {
    expect(isEven(0)).toBe(true)
  })
})
