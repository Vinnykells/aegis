/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', 'sans-serif'],
      },
      colors: {
        aegis: {
          bg:      '#0C0A00',
          surface: '#131100',
          card:    '#1A1700',
          border:  '#2A2500',
          gray:    '#8A8070',
          white:   '#F5F0E0',
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
