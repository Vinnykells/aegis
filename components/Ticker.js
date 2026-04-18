'use client'

const rates = [
  { from: '🇬🇧 GBP', to: 'USD', rate: '£1 = $1.27', change: '+0.2%' },
  { from: '🇪🇺 EUR', to: 'USD', rate: '€1 = $1.09', change: '+0.1%' },
  { from: '🇯🇵 JPY', to: 'USD', rate: '¥150 = $1', change: '-0.3%' },
  { from: '🇨🇦 CAD', to: 'USD', rate: 'CA$1.35 = $1', change: '+0.2%' },
  { from: '🇦🇺 AUD', to: 'USD', rate: 'A$1.53 = $1', change: '+0.1%' },
  { from: '🇨🇭 CHF', to: 'USD', rate: 'CHF0.90 = $1', change: '-0.1%' },
  { from: '🇸🇬 SGD', to: 'USD', rate: 'S$1.34 = $1', change: '+0.3%' },
  { from: '🇦🇪 AED', to: 'USD', rate: 'AED3.67 = $1', change: '0.0%' },
  { from: '🇳🇬 NGN', to: 'USD', rate: '₦1,580 = $1', change: '+0.4%' },
  { from: '🇮🇳 INR', to: 'USD', rate: '₹83 = $1', change: '-0.1%' },
  { from: '🇧🇷 BRL', to: 'USD', rate: 'R$4.97 = $1', change: '+0.2%' },
  { from: '🇲🇽 MXN', to: 'USD', rate: 'MX$17.1 = $1', change: '-0.2%' },
]

export default function Ticker() {
  return (
    <div className="border-y border-gold/10 bg-aegis-surface/50 py-3 overflow-hidden">
      <div className="flex ticker-animate gap-0">
        {[...rates, ...rates].map((rate, index) => (
          <div key={index} className="flex items-center gap-3 px-8 flex-shrink-0 border-r border-gold/10 last:border-r-0">
            <span className="text-aegis-gray text-sm whitespace-nowrap">{rate.from} → {rate.to}</span>
            <span className="text-aegis-white text-sm font-medium whitespace-nowrap">{rate.rate}</span>
            <span className={`text-xs whitespace-nowrap ${
              rate.change.startsWith('+') ? 'text-green-400' : rate.change === '0.0%' ? 'text-aegis-gray' : 'text-red-400'
            }`}>
              {rate.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
