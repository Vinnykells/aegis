# Aegis 🛡️

A premium fintech landing page built with Next.js 14, Tailwind CSS and Framer Motion.

Aegis is a global money transfer platform — send money anywhere in the world instantly, at real exchange rates, with zero hidden fees.

---

## Tech Stack

- **Next.js 14** — App Router
- **Tailwind CSS** — styling + custom design tokens
- **Framer Motion** — animations
- **Inter** — via `next/font/google`

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
aegis/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
└── components/
    ├── Navbar.js
    ├── Hero.js
    ├── Ticker.js
    ├── Stats.js
    ├── Features.js
    ├── HowItWorks.js
    ├── Testimonials.js
    ├── Pricing.js
    ├── FAQ.js
    ├── CTA.js
    ├── Footer.js
    ├── AnimatedSection.js
    └── ProtectedButton.js
```

---

## Design System

Custom Tailwind tokens:

| Token | Value |
|---|---|
| `aegis-bg` | `#0C0A00` |
| `aegis-surface` | `#131100` |
| `aegis-gray` | `#8A8070` |
| `aegis-white` | `#F5F0E0` |
| `gold` | `#C6A84B` |
| `gold-light` | `#E2C97E` |

Global CSS utilities: `.glass-card`, `.gradient-text`, `.gold-glow`, `.ticker-animate`

---

## Features

- Glassmorphism cards with gold glow
- Scroll-triggered animations with blur filter
- Shield pulse ring animation
- Shimmer + border-draw button effects
- Live currency ticker (12 currencies, seamless loop)
- Floating dashboard mockup cards
- Fully responsive — mobile menu included
- Noise texture overlay
- Custom gold scrollbar

---

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # start production server
npm run lint     # lint
```
