# Aegis 🛡️

A premium fintech landing page built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.

Aegis is a global money transfer platform — send money anywhere in the world instantly, at real exchange rates, with zero hidden fees.

---

## 🚀 Features

- **Premium Glassmorphism:** High-end UI featuring glass-cards with custom gold glow effects and a noise texture overlay.
- **Advanced Animations:** Scroll-triggered entrance effects, shield pulse rings, and floating dashboard mockups powered by **Framer Motion**.
- **Interactive UI Elements:**
  - Shimmer + border-draw button effects for high-conversion CTAs.
  - Live currency ticker (12 currencies) with a seamless CSS loop.
  - Interactive pricing toggle with a 20% discount logic display.
- **Design Excellence:** Custom gold scrollbar, `.gradient-text` utilities, and a fully responsive mobile menu.

---

## 🎨 Design System

A sophisticated dark-palette design system built to evoke trust and luxury.

| Token | Value | Preview |
|---|---|---|
| `aegis-bg` | `#0C0A00` | ⬛ |
| `aegis-surface` | `#131100` | ⬛ |
| `aegis-gray` | `#8A8070` | 🔘 |
| `aegis-white` | `#F5F0E0` | ⬜ |
| `gold` | `#C6A84B` | 🟨 |
| `gold-light` | `#E2C97E` | ✨ |

### Global Utilities

- `.glass-card` — Backdrop blur with subtle border transparency.
- `.gold-glow` — Box-shadow accents using the `gold` token.
- `.ticker-animate` — High-performance transform-based animation.

---

## 📸 Visual Showcase

### Hero

![Aegis Hero](./screenshots/Aegis%20Heo.png)

### User Onboarding Flow

![Aegis Onboarding](./screenshots/Aegis%20onboarding.png)

### Transparent Pricing

![Aegis Pricing](./screenshots/Aegis%20Pricing.png)

---

## 🛠️ Tech Stack

- **Next.js 14** — App Router & Server Components
- **Tailwind CSS** — Styling & Design Tokens
- **Framer Motion** — Interaction & Motion Design
- **Inter** — Typography via `next/font/google`

---

## 📂 Project Structure

```bash
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

## ⚙️ Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Vinnykells/aegis.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🔗 Links

- **Repo:** [https://github.com/Vinnykells/aegis](https://github.com/Vinnykells/aegis)
- **Live Demo:** [https://aegis-vinnykells.vercel.app/](https://aegis-vinnykells.vercel.app/)
