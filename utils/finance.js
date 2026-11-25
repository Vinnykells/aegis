export const currencies = [
  { code: 'USD', name: 'US dollar', symbol: '$', rate: 1 },
  { code: 'GBP', name: 'British pound', symbol: '£', rate: 0.79 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'NGN', name: 'Nigerian naira', symbol: '₦', rate: 1580 },
  { code: 'CAD', name: 'Canadian dollar', symbol: 'CA$', rate: 1.35 },
  { code: 'AED', name: 'UAE dirham', symbol: 'AED', rate: 3.67 },
]

export function getExchangeRate(sourceCurrency, destinationCurrency) {
  const source = currencies.find((currency) => currency.code === sourceCurrency)
  const destination = currencies.find((currency) => currency.code === destinationCurrency)
  if (!source || !destination) return 1
  return destination.rate / source.rate
}

export function formatMoney(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0))
}
