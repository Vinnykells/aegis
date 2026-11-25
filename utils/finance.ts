export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  rate: number
}

export const currencies: CurrencyInfo[] = [
  { code: 'USD', name: 'US dollar',           symbol: '$',    rate: 1       },
  { code: 'GBP', name: 'British pound',        symbol: '£',    rate: 0.79    },
  { code: 'EUR', name: 'Euro',                 symbol: '€',    rate: 0.92    },
  { code: 'NGN', name: 'Nigerian naira',       symbol: '₦',    rate: 1580    },
  { code: 'CAD', name: 'Canadian dollar',      symbol: 'CA$',  rate: 1.35    },
  { code: 'AED', name: 'UAE dirham',           symbol: 'AED',  rate: 3.67    },
  { code: 'JPY', name: 'Japanese yen',         symbol: '¥',    rate: 150     },
  { code: 'AUD', name: 'Australian dollar',    symbol: 'A$',   rate: 1.53    },
  { code: 'CHF', name: 'Swiss franc',          symbol: 'CHF',  rate: 0.90    },
  { code: 'SGD', name: 'Singapore dollar',     symbol: 'S$',   rate: 1.34    },
  { code: 'INR', name: 'Indian rupee',         symbol: '₹',    rate: 83      },
  { code: 'BRL', name: 'Brazilian real',       symbol: 'R$',   rate: 4.97    },
  { code: 'MXN', name: 'Mexican peso',         symbol: 'MX$',  rate: 17.1    },
  { code: 'ZAR', name: 'South African rand',   symbol: 'R',    rate: 18.6    },
  { code: 'KES', name: 'Kenyan shilling',      symbol: 'KSh',  rate: 129     },
  { code: 'GHS', name: 'Ghanaian cedi',        symbol: 'GH₵',  rate: 12.3    },
]

export function getExchangeRate(sourceCurrency: string, destinationCurrency: string): number {
  const source      = currencies.find((c) => c.code === sourceCurrency)
  const destination = currencies.find((c) => c.code === destinationCurrency)
  if (!source || !destination) return 1
  return destination.rate / source.rate
}

export function formatMoney(amount: number | string | null | undefined, currency = 'USD'): string {
  // Fall back to plain number if currency isn't in Intl's list
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0))
  } catch {
    const meta = currencies.find((c) => c.code === currency)
    return `${meta?.symbol ?? currency}${Number(amount || 0).toFixed(2)}`
  }
}
