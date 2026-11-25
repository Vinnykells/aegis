import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'

const inter = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aegis-finance.vercel.app'),
  title: 'Aegis — The Shield Your Money Deserves',
  description: 'Move money anywhere in the world in seconds. Save smart, spend freely and protect your financial future with Aegis.',
  openGraph: {
    title: 'Aegis — The Shield Your Money Deserves',
    description: 'Move money anywhere in the world in seconds. Save smart, spend freely.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      {/* Inline script eliminates flash of wrong theme on load */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var saved = localStorage.getItem('aegis-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (prefersDark ? 'dark' : 'light');
  if (theme === 'light') document.documentElement.classList.add('light');
})()`,
          }}
        />
      </head>
      <body className={`${inter.className} bg-aegis-bg`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
