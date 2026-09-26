export const SHIPPING_FREE_THRESHOLD_CENTS = 3500
export const FLAT_SHIPPING_CENTS = 499

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatPrice(cents: number): string {
  return currency.format(cents / 100)
}