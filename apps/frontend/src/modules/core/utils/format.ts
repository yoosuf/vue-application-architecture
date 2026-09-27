export const DEFAULT_LOCALE = 'en-US'
export const DEFAULT_CURRENCY = 'USD'
export const EMPTY_VALUE = '—'

export type DateInput = Date | number | string

export interface CurrencyOptions {
  locale?: string
  currency?: string
  compact?: boolean
}

export interface DateOptions extends Intl.DateTimeFormatOptions {
  locale?: string
}

const numberFormatters = new Map<string, Intl.NumberFormat>()
const dateFormatters = new Map<string, Intl.DateTimeFormat>()

function numberFormatter(
  options: Required<CurrencyOptions>,
): Intl.NumberFormat {
  const key = `${options.locale}|${options.currency}|${options.compact}`
  const cached = numberFormatters.get(key)
  if (cached) return cached

  const formatter = new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: options.currency,
    notation: options.compact ? 'compact' : 'standard',
    minimumFractionDigits: options.compact ? 0 : 2,
    maximumFractionDigits: options.compact ? 1 : 2,
  })
  numberFormatters.set(key, formatter)
  return formatter
}

function dateFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}|${JSON.stringify(options)}`
  const cached = dateFormatters.get(key)
  if (cached) return cached

  const formatter = new Intl.DateTimeFormat(locale, options)
  dateFormatters.set(key, formatter)
  return formatter
}

function toDate(value: DateInput): Date | null {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatCurrency(
  cents: number,
  options: CurrencyOptions = {},
): string {
  if (!Number.isFinite(cents)) return EMPTY_VALUE

  return numberFormatter({
    locale: options.locale ?? DEFAULT_LOCALE,
    currency: options.currency ?? DEFAULT_CURRENCY,
    compact: options.compact ?? false,
  }).format(Math.round(cents) / 100)
}

export function formatDate(
  value: DateInput,
  options: DateOptions = {},
): string {
  const date = toDate(value)
  if (!date) return EMPTY_VALUE

  const { locale = DEFAULT_LOCALE, ...intlOptions } = options
  return dateFormatter(locale, intlOptions).format(date)
}
