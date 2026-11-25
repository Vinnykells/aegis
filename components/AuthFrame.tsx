import type { ReactNode } from 'react'

interface AuthFrameProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export default function AuthFrame({ eyebrow, title, description, children, footer }: AuthFrameProps) {
  return (
    <main className="min-h-screen bg-[#090b10] text-[#f7f8fa] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.85fr)]">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(245,158,11,0.13),transparent_30%),radial-gradient(circle_at_90%_100%,rgba(59,130,246,0.10),transparent_30%)]" />
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-200 to-transparent" />
        <div className="relative w-full max-w-[430px]">
          <a href="/" className="mb-14 inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-base text-[#1b1304] shadow-[0_8px_30px_rgba(245,158,11,0.28)]">A</span>
            Aegis
          </a>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">{eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">{description}</p>
          <div className="mt-9 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-1 shadow-2xl shadow-black/20">
            <div className="rounded-[0.9rem] bg-[#10131b] p-5 sm:p-6">{children}</div>
          </div>
          <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden border-l border-white/[0.08] bg-[#0e1118] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-amber-400/[0.09] blur-3xl" />
        <div className="absolute -bottom-16 -left-20 h-80 w-80 rounded-full bg-blue-500/[0.10] blur-3xl" />
        <div className="relative flex items-center justify-between text-xs font-medium text-zinc-500"><span>AEGIS WALLET</span><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-300">All systems normal</span></div>
        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Built for control</p>
          <h2 className="mt-5 text-4xl font-medium leading-[1.08] tracking-[-0.05em] text-white">One place for every balance, transfer, and goal.</h2>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4"><p className="text-xs text-zinc-500">Treasury balance</p><p className="mt-2 text-xl font-medium text-white">NGN 24.8m</p><p className="mt-3 text-xs text-emerald-300">+12.4% this month</p></div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4"><p className="text-xs text-zinc-500">Payments cleared</p><p className="mt-2 text-xl font-medium text-white">98.6%</p><p className="mt-3 text-xs text-zinc-400">This week</p></div>
          </div>
        </div>
        <p className="relative text-xs leading-5 text-zinc-600">Aegis gives you a clearer, safer way to move and manage money globally.</p>
      </aside>
    </main>
  )
}
