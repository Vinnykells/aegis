import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  metadataBase: new URL('https://aegis-finance.vercel.app'),
  title: 'Aegis — The Shield Your Money Deserves',
  description: 'Move money anywhere in the world in seconds. Save smart, spend freely and protect your financial future with Aegis.',
  openGraph: {
    title: 'Aegis — The Shield Your Money Deserves',
    description: 'Move money anywhere in the world in seconds. Save smart, spend freely.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-aegis-bg`}>
        {children}
      </body>
    </html>
  )
}
