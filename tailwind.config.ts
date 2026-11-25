import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', 'sans-serif'],
      },
      colors: {
        aegis: {
          bg:      'var(--aegis-bg)',
          surface: 'var(--aegis-surface)',
          card:    'var(--aegis-card)',
          border:  'var(--aegis-border)',
          gray:    'var(--aegis-gray)',
          white:   'var(--aegis-white)',
        },
        gold: {
          DEFAULT: '#C6A84B',
          light:   '#E2C97E',
          bright:  '#FFD700',
          dark:    '#9A7A2E',
          subtle:  'rgba(198, 168, 75, 0.1)',
        },
      },
      animation: {
        'shield-pulse': 'shieldPulse 2s ease-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3.5s ease-in-out infinite 0.5s',
      },
      keyframes: {
        shieldPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
