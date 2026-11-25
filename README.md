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

<div align="center">
  <img src="./screenshots/Aegis Hero.png" width="600" />
  <img src="./screenshots/Aegis Hero Mobile.png" width="200" />
</div>

### User Onboarding Flow

<div align="center">
  <img src="./screenshots/Aegis onboarding.png" width="600" />
  <img src="./screenshots/Aegis onboarding Mobile.png" width="200" />
</div>

### Transparent Pricing

<div align="center">
  <img src="./screenshots/Aegis Pricing.png" width="600" />
  <img src="./screenshots/Aegis Pricing Mobile.png" width="200" />
</div>

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

### Backend Setup

Copy `.env.example` to `.env.local` and fill in the Supabase keys you already use. Keep `SUPABASE_SERVICE_ROLE_KEY`, payment keys, and Resend keys server-only; never prefix those values with `NEXT_PUBLIC_`.

Apply `supabase/migrations/20261124000002_consumer_wallets.sql` to enable the consumer Aegis product: profiles, personal wallets, virtual cards, transfers, savings goals, RLS, and existing-user backfill. This migration replaces the earlier organization-signup trigger with consumer account provisioning.

`supabase/migrations/20261124000000_create_workspace_on_signup.sql` and `supabase/migrations/20261124000001_complete_payment_atomically.sql` are legacy work from the earlier multi-tenant direction. They are not used by the consumer wallet UI.

In **Supabase Dashboard → Authentication → URL Configuration**, add both `http://localhost:3000/auth/callback` and your deployed URL followed by `/auth/callback` to the redirect allow list. This lets confirmed email links return users to their new dashboard.

Configure payment providers to POST webhooks to `/api/webhooks/payments`. Paystack uses `x-paystack-signature`; Stripe uses `stripe-signature`. The webhook only accepts verified requests and ignores already-completed references.

---

## 🔗 Links

- **Repo:** [https://github.com/Vinnykells/aegis](https://github.com/Vinnykells/aegis)
- **Live Demo:** [https://aegis-vinnykells.vercel.app/](https://aegis-vinnykells.vercel.app/)
