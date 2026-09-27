import {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  EMPTY_VALUE,
  formatCurrency,
  formatDate,
} from '@/modules/core'

describe('formatCurrency', () => {
  it('formats integer cents as US dollars', () => {
    expect(formatCurrency(0)).toBe('$0.00')
    expect(formatCurrency(1234)).toBe('$12.34')
    expect(formatCurrency(123456)).toBe('$1,234.56')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-500)).toBe('-$5.00')
  })

  it('rounds fractional cents to the nearest cent', () => {
    expect(formatCurrency(1200.4)).toBe('$12.00')
    expect(formatCurrency(1200.5)).toBe('$12.01')
  })

  it('honours a locale and currency override', () => {
    expect(formatCurrency(1234, { locale: 'en-GB', currency: 'GBP' })).toBe(
      '£12.34',
    )
    expect(formatCurrency(1234, { currency: 'EUR' })).toBe('€12.34')
  })

  it('supports compact notation', () => {
    expect(formatCurrency(123456789, { compact: true })).toBe('$1.2M')
  })

  it('falls back for non-finite amounts', () => {
    expect(formatCurrency(Number.NaN)).toBe(EMPTY_VALUE)
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe(EMPTY_VALUE)
  })

  it('reuses the cached formatter for repeated calls', () => {
    expect(formatCurrency(1000)).toBe(formatCurrency(1000))
    expect(formatCurrency(1000)).toBe('$10.00')
  })
})

describe('formatDate', () => {
  const noon = new Date(2026, 8, 26, 12)
  const iso = '2026-09-26T12:00:00.000Z'

  it('defaults to a numeric US date', () => {
    expect(formatDate(noon)).toBe('9/26/2026')
  })

  it('accepts a long month and year', () => {
    expect(
      formatDate(noon, { year: 'numeric', month: 'long', day: 'numeric' }),
    ).toBe('September 26, 2026')
  })

  it('accepts a short weekday, like delivery estimates', () => {
    expect(
      formatDate(noon, { weekday: 'short', month: 'short', day: 'numeric' }),
    ).toBe('Sat, Sep 26')
  })

  it('accepts Date, epoch milliseconds and ISO strings', () => {
    const options = { timeZone: 'UTC', dateStyle: 'medium' } as const

    expect(formatDate(noon, options)).toBe('Sep 26, 2026')
    expect(formatDate(noon.getTime(), options)).toBe('Sep 26, 2026')
    expect(formatDate(iso, options)).toBe('Sep 26, 2026')
  })

  it('renders a date and time from style options', () => {
    expect(
      formatDate(iso, {
        timeZone: 'UTC',
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    ).toBe('Sep 26, 2026, 12:00 PM')
  })

  it('falls back for invalid values', () => {
    expect(formatDate('not-a-date')).toBe(EMPTY_VALUE)
    expect(formatDate(new Date('nope'))).toBe(EMPTY_VALUE)
  })
})

describe('defaults', () => {
  it('exposes the shared locale and currency', () => {
    expect(DEFAULT_LOCALE).toBe('en-US')
    expect(DEFAULT_CURRENCY).toBe('USD')
  })
})
