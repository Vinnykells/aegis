'use client'

import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { Card, Profile, SavingsGoal, Transfer, Wallet } from '@/types'
import { currencies, formatMoney, getExchangeRate } from '@/utils/finance'
import { createClient } from '@/utils/supabase/client'

type ModalKind = 'send' | 'goal' | 'add-money' | 'convert' | 'card' | null

interface DashboardClientProps {
  userEmail: string
  profile: Profile | null
  wallets: Wallet[]
  transfers: Transfer[]
  goals: SavingsGoal[]
  card: Card | null
}

interface ModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function api<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const payload = (await response.json()) as T & { error?: string }
  if (!response.ok) throw new Error(payload.error || 'Something went wrong.')
  return payload
}

function initials(value: string): string {
  return value?.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() || 'A'
}

function currencyMeta(code: string) {
  return currencies.find((c) => c.code === code) || { code, name: code, symbol: code }
}

// ── Modal shell ────────────────────────────────────────────────────────────

function Modal({ title, subtitle, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#07111d]/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-[#101722] p-6 text-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Aegis</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
            {subtitle && <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-white/[0.07] text-slate-300 hover:bg-white/[0.12]"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function DashboardClient({
  userEmail,
  profile,
  wallets,
  transfers,
  goals,
  card,
}: DashboardClientProps) {
  const router = useRouter()

  // UI state
  const [modal, setModal]   = useState<ModalKind>(null)
  const [error, setError]   = useState('')
  const [notice, setNotice] = useState('')

  // Send-money form
  const [recipientName,       setRecipientName]       = useState('')
  const [recipientEmail,      setRecipientEmail]       = useState('')
  const [sourceWalletId,      setSourceWalletId]       = useState(wallets[0]?.id || '')
  const [destinationCurrency, setDestinationCurrency] = useState('NGN')
  const [amount,              setAmount]               = useState('')

  // Savings-goal form
  const [goalName,     setGoalName]     = useState('')
  const [goalAmount,   setGoalAmount]   = useState('')
  const [goalCurrency, setGoalCurrency] = useState('USD')

  // Convert form
  const [convertSourceId,       setConvertSourceId]       = useState(wallets[0]?.id || '')
  const [convertTargetCurrency, setConvertTargetCurrency] = useState('EUR')
  const [convertAmount,         setConvertAmount]         = useState('')

  // ── Derived values ───────────────────────────────────────────────────────

  const primaryWallet     = wallets.find((w) => w.is_primary) || wallets[0]
  const sourceWallet      = wallets.find((w) => w.id === sourceWalletId) || primaryWallet
  const sourceCurrency    = sourceWallet?.currency || 'USD'
  const exchangeRate      = getExchangeRate(sourceCurrency, destinationCurrency)
  const convertedAmount   = Number(amount || 0) * exchangeRate
  const transferFee       = Math.max(0.5, Number(amount || 0) * 0.003)

  const convertSourceWallet   = wallets.find((w) => w.id === convertSourceId) || primaryWallet
  const convertSourceCurrency = convertSourceWallet?.currency || 'USD'
  const convertRate           = getExchangeRate(convertSourceCurrency, convertTargetCurrency)
  const convertResult         = Number(convertAmount || 0) * convertRate

  const displayName  = profile?.full_name || userEmail?.split('@')[0] || 'there'
  const totalBalance = primaryWallet?.balance || 0

  const recentRates = useMemo(
    () => currencies.filter((c) => c.code !== sourceCurrency).slice(0, 4),
    [sourceCurrency]
  )

  // ── Spending insights (computed from existing transfers data) ─────────────

  const insights = useMemo(() => {
    const now       = new Date()
    const thisMonth = transfers.filter((t) => {
      const d = new Date(t.created_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const totalSent = thisMonth.reduce((s, t) => s + Number(t.amount || 0), 0)
    const allTotal  = transfers.reduce((s, t) => s + Number(t.amount || 0), 0)
    const avgSize   = transfers.length > 0 ? allTotal / transfers.length : 0

    // Group by destination currency
    const byCurrency: Record<string, number> = {}
    transfers.forEach((t) => {
      const key = t.destination_currency || t.destination_currency_code || 'USD'
      byCurrency[key] = (byCurrency[key] || 0) + Number(t.amount || 0)
    })
    const breakdownTotal = Object.values(byCurrency).reduce((a, b) => a + b, 0)
    const breakdown = Object.entries(byCurrency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([currency, amt]) => ({
        currency,
        amount: amt,
        pct: breakdownTotal > 0 ? Math.round((amt / breakdownTotal) * 100) : 0,
      }))

    return { thisMonth, totalSent, count: thisMonth.length, avgSize, breakdown }
  }, [transfers])

  // ── Action helpers ───────────────────────────────────────────────────────

  const completeAction = async (action: () => Promise<void>, successMessage: string) => {
    setError('')
    setNotice('')
    try {
      await action()
      setNotice(successMessage)
      setModal(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const handleTransfer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void completeAction(async () => {
      await api('/api/transfers', {
        method: 'POST',
        body: JSON.stringify({ walletId: sourceWalletId, recipientName, recipientEmail, destinationCurrency, amount }),
      })
      setRecipientName(''); setRecipientEmail(''); setAmount('')
    }, 'Transfer sent. Track it in Recent activity.')
  }

  const handleGoal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void completeAction(async () => {
      await api('/api/savings', {
        method: 'POST',
        body: JSON.stringify({ name: goalName, targetAmount: goalAmount, currency: goalCurrency }),
      })
      setGoalName(''); setGoalAmount('')
    }, 'Savings goal created.')
  }

  const handleConvert = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void completeAction(async () => {
      await api('/api/convert', {
        method: 'POST',
        body: JSON.stringify({ sourceWalletId: convertSourceId, targetCurrency: convertTargetCurrency, amount: convertAmount }),
      })
      setConvertAmount('')
    }, `Converted to ${convertTargetCurrency}. Your wallets have been updated.`)
  }

  const signOut = async () => {
    await createClient().auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  // ── Shared class strings ─────────────────────────────────────────────────

  const inputCls  = 'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-amber-300 transition'
  const selectCls = 'mt-2 w-full rounded-xl border border-white/10 bg-[#101722] px-3 py-3 text-sm outline-none cursor-pointer'
  const rateCls   = 'rounded-xl bg-white/[0.05] p-4 text-sm space-y-2'

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#07111d] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(83,153,255,0.17),transparent_30%),radial-gradient(circle_at_0%_30%,rgba(245,158,11,0.10),transparent_24%)]" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="relative border-b border-white/[0.08] bg-[#07111d]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 text-sm text-[#1e1605] shadow-lg shadow-amber-500/20">A</span>
            Aegis
          </a>
          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#home"     className="text-white">Home</a>
            <a href="#activity" className="hover:text-white transition-colors">Activity</a>
            <a href="#savings"  className="hover:text-white transition-colors">Savings</a>
            <a href="#insights" className="hover:text-white transition-colors">Insights</a>
            <a href="#card"     className="hover:text-white transition-colors">Card</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal('send')}
              className="rounded-lg bg-[#f4c653] px-3.5 py-2 text-xs font-bold text-[#221804] transition hover:bg-[#ffd875]"
            >
              Send money
            </button>
            <button
              onClick={signOut}
              title="Sign out"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-[11px] font-bold text-amber-200"
            >
              {initials(displayName)}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main id="home" className="relative mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-12">

        {/* Greeting row */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm text-slate-400">Welcome back</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
              Hello, {displayName.split(' ')[0]}.
            </h1>
          </div>
          <button
            onClick={() => setModal('add-money')}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/[0.1]"
          >
            ＋ Add money
          </button>
        </div>

        {/* Error / notice banner */}
        {(error || notice) && (
          <p className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
            error
              ? 'border-red-400/25 bg-red-400/10 text-red-100'
              : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
          }`}>
            {error || notice}
          </p>
        )}

        {/* ── Balance card + Aegis card ──────────────────────────────────── */}
        <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">

          {/* Balance */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-[#1c2d47] via-[#14243a] to-[#101924] p-6 shadow-2xl shadow-black/25 sm:p-8">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-amber-300/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">Total balance</p>
                <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-[11px] text-slate-300">Personal account</span>
              </div>
              <p className="mt-8 text-4xl font-medium tracking-[-0.065em] sm:text-5xl">
                {formatMoney(totalBalance, primaryWallet?.currency || 'USD')}
              </p>
              <p className="mt-3 text-sm text-slate-400">Your primary wallet balance</p>
              <div className="mt-9 grid grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
                <button onClick={() => setModal('send')}
                  className="rounded-xl bg-[#f4c653] px-3 py-3 text-sm font-semibold text-[#241905]">
                  ↑ <span className="hidden sm:inline">Send</span>
                </button>
                <button onClick={() => setModal('add-money')}
                  className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-3 text-sm font-medium text-white hover:bg-white/[0.1] transition">
                  ↓ <span className="hidden sm:inline">Add</span>
                </button>
                <button onClick={() => setModal('convert')}
                  className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-3 text-sm font-medium text-white hover:bg-white/[0.1] transition">
                  ↻ <span className="hidden sm:inline">Convert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Virtual card */}
          <div id="card" className="rounded-[1.75rem] border border-white/10 bg-[#101924] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Your Aegis card</p>
                <p className="mt-1 text-xs text-slate-400">Ready for global spending</p>
              </div>
              <span className="text-xl text-amber-300">◒</span>
            </div>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#d8a933] via-[#f4c653] to-[#fff0b1] p-5 text-[#1d1606] shadow-lg">
              <div className="flex justify-between text-[11px] font-bold tracking-[0.18em]">
                <span>AEGIS</span><span>VIRTUAL</span>
              </div>
              <p className="mt-11 font-mono text-lg tracking-[0.2em]">•••• {card?.last4 || '0000'}</p>
              <div className="mt-5 flex items-end justify-between text-[10px] font-semibold uppercase tracking-wider">
                <span>{displayName}</span>
                <span>{card?.status || 'ACTIVE'}</span>
              </div>
            </div>
            <button onClick={() => setModal('card')} className="mt-5 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors">
              Manage card →
            </button>
          </div>
        </section>

        {/* ── Wallets + Live exchange ────────────────────────────────────── */}
        <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">

          {/* Wallets */}
          <div className="rounded-[1.5rem] border border-white/10 bg-[#101924] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-[-0.02em]">Your wallets</h2>
                <p className="mt-1 text-xs text-slate-400">Hold and move money in multiple currencies</p>
              </div>
              <button onClick={() => setModal('convert')} className="text-xs font-semibold text-amber-300">Add currency</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {wallets.map((wallet) => {
                const meta = currencyMeta(wallet.currency)
                return (
                  <div key={wallet.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <div className="flex items-start justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.08] text-xs font-bold text-slate-200">{meta.code}</span>
                      {wallet.is_primary && (
                        <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">Primary</span>
                      )}
                    </div>
                    <p className="mt-5 text-sm text-slate-400">{meta.name}</p>
                    <p className="mt-1 text-xl font-semibold tracking-[-0.04em]">{formatMoney(wallet.balance, wallet.currency)}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Live rates */}
          <div className="rounded-[1.5rem] border border-white/10 bg-[#101924] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-[-0.02em]">Live exchange</h2>
                <p className="mt-1 text-xs text-slate-400">Mid-market indicative rates</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">Live</span>
            </div>
            <div className="mt-5 space-y-3">
              {recentRates.map((currency) => (
                <div key={currency.code} className="flex items-center justify-between rounded-xl bg-white/[0.035] px-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{sourceCurrency} → {currency.code}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      1 {sourceCurrency} = {getExchangeRate(sourceCurrency, currency.code).toFixed(4)} {currency.code}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-emerald-300">+0.2%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Activity + Savings ─────────────────────────────────────────── */}
        <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">

          {/* Recent activity */}
          <div id="activity" className="rounded-[1.5rem] border border-white/10 bg-[#101924]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-semibold tracking-[-0.02em]">Recent activity</h2>
                <p className="mt-1 text-xs text-slate-400">Every transfer in one place</p>
              </div>
              <button className="text-xs font-semibold text-amber-300">See all</button>
            </div>
            {transfers.length ? (
              <div className="divide-y divide-white/[0.07]">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400/10 text-amber-300">↑</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">To {transfer.recipient_name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(transfer.created_at).toLocaleDateString()} · {transfer.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">−{formatMoney(transfer.amount, sourceCurrency)}</p>
                      <p className={`mt-1 text-[11px] font-semibold ${transfer.status === 'COMPLETED' ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {transfer.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-14 text-center">
                <span className="grid mx-auto h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-slate-400">↗</span>
                <p className="mt-4 text-sm font-medium">Your activity will appear here</p>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">Make your first transfer when you are ready.</p>
                <button onClick={() => setModal('send')} className="mt-5 text-sm font-semibold text-amber-300">Send money →</button>
              </div>
            )}
          </div>

          {/* Savings */}
          <div id="savings" className="rounded-[1.5rem] border border-white/10 bg-[#101924] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-[-0.02em]">Savings</h2>
                <p className="mt-1 text-xs text-slate-400">Build toward what matters</p>
              </div>
              <button onClick={() => setModal('goal')} className="text-xs font-semibold text-amber-300">New goal</button>
            </div>

            {/* APY badge */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-400/10 px-3 py-2.5">
              <span className="text-amber-300">✦</span>
              <p className="text-xs text-amber-200">
                Earn up to <span className="font-bold text-amber-300">8.5% APY</span> on your savings goals
              </p>
            </div>

            <div className="mt-5 space-y-5">
              {goals.length ? (
                goals.map((goal) => {
                  const percent = Math.min(100, (Number(goal.current_amount) / Number(goal.target_amount)) * 100)
                  return (
                    <div key={goal.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{goal.name}</span>
                        <span className="text-slate-400">{Math.round(percent)}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-200 transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {formatMoney(goal.current_amount, goal.currency)} of {formatMoney(goal.target_amount, goal.currency)}
                      </p>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-9 text-center">
                  <p className="text-sm font-medium">Save with intention</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Set a goal for travel, a home, or your next big move.</p>
                  <button onClick={() => setModal('goal')} className="mt-4 text-sm font-semibold text-amber-300">Create a goal →</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Financial Insights ─────────────────────────────────────────── */}
        <section id="insights" className="mt-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#101924] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-[-0.02em]">Financial insights</h2>
                <p className="mt-1 text-xs text-slate-400">Understand where your money goes</p>
              </div>
              <span className="rounded-full bg-blue-400/10 px-2 py-1 text-[10px] font-semibold text-blue-300">This month</span>
            </div>

            {transfers.length > 0 ? (
              <>
                {/* Summary cards */}
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <p className="text-xs text-slate-500">Sent this month</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">{formatMoney(insights.totalSent, sourceCurrency)}</p>
                    <p className="mt-1 text-xs text-slate-500">{insights.count} transfer{insights.count !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <p className="text-xs text-slate-500">Total transfers</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">{transfers.length}</p>
                    <p className="mt-1 text-xs text-slate-500">All time</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <p className="text-xs text-slate-500">Average transfer</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">{formatMoney(insights.avgSize, sourceCurrency)}</p>
                    <p className="mt-1 text-xs text-slate-500">Per transaction</p>
                  </div>
                </div>

                {/* Spend breakdown */}
                {insights.breakdown.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Spending by destination</p>
                    <div className="space-y-4">
                      {insights.breakdown.map(({ currency, amount: amt, pct }) => (
                        <div key={currency}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{currency}</span>
                            <span className="text-xs text-slate-400">{formatMoney(amt, sourceCurrency)} · {pct}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-200 transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center">
                <span className="grid mx-auto h-12 w-12 place-items-center rounded-full bg-white/[0.06] text-2xl">📊</span>
                <p className="mt-4 text-sm font-medium">No spending data yet</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Your insights will appear here after your first transfer.</p>
                <button onClick={() => setModal('send')} className="mt-5 text-sm font-semibold text-amber-300">Send money →</button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ══ Modals ══════════════════════════════════════════════════════════ */}

      {/* Send money */}
      {modal === 'send' && (
        <Modal
          title="Send money"
          subtitle="Securely send from your Aegis wallet to anyone, anywhere."
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleTransfer} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Send from
              <select value={sourceWalletId} onChange={(e) => setSourceWalletId(e.target.value)} className={selectCls}>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>{w.currency} · {formatMoney(w.balance, w.currency)}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Recipient name
              <input required value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Who are you sending to?" className={inputCls} />
            </label>
            <label className="block text-sm font-medium">
              Recipient email <span className="font-normal text-slate-500">optional</span>
              <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="recipient@email.com" className={inputCls} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Amount
                <input type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className={inputCls} />
              </label>
              <label className="block text-sm font-medium">
                Recipient gets
                <select value={destinationCurrency} onChange={(e) => setDestinationCurrency(e.target.value)} className={selectCls}>
                  {currencies.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                </select>
              </label>
            </div>
            <div className={rateCls}>
              <div className="flex justify-between text-slate-400"><span>Rate</span><span>1 {sourceCurrency} = {exchangeRate.toFixed(4)} {destinationCurrency}</span></div>
              <div className="flex justify-between text-slate-400"><span>Recipient gets</span><span>{formatMoney(convertedAmount, destinationCurrency)}</span></div>
              <div className="flex justify-between font-medium"><span>Transfer fee</span><span>{formatMoney(transferFee, sourceCurrency)}</span></div>
            </div>
            <button className="w-full rounded-xl bg-[#f4c653] py-3 text-sm font-bold text-[#221804] hover:bg-[#ffd875] transition">
              Confirm &amp; send
            </button>
          </form>
        </Modal>
      )}

      {/* Savings goal */}
      {modal === 'goal' && (
        <Modal
          title="Create a savings goal"
          subtitle="Give your money a purpose and watch your progress build."
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleGoal} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Goal name
              <input required value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="Trip to London" className={inputCls} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Target amount
                <input type="number" min="1" required value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="5,000" className={inputCls} />
              </label>
              <label className="block text-sm font-medium">
                Currency
                <select value={goalCurrency} onChange={(e) => setGoalCurrency(e.target.value)} className={selectCls}>
                  {currencies.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-400/10 px-3 py-2.5 text-xs text-amber-200">
              <span>✦</span>
              <span>You earn up to <strong>8.5% APY</strong> on this goal. Interest applied monthly.</span>
            </div>
            <button className="w-full rounded-xl bg-[#f4c653] py-3 text-sm font-bold text-[#221804] hover:bg-[#ffd875] transition">
              Create savings goal
            </button>
          </form>
        </Modal>
      )}

      {/* Add money */}
      {modal === 'add-money' && (
        <Modal
          title="Add money"
          subtitle="Fund your Aegis wallet by bank transfer."
          onClose={() => setModal(null)}
        >
          <div className="mt-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Your virtual account details</p>
            <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm">
              {[
                { label: 'Bank',           value: 'Aegis Partner Bank' },
                { label: 'Account name',   value: displayName },
                { label: 'Account number', value: '00284739' },
                { label: 'Sort code',      value: '04-00-75' },
                { label: 'Reference',      value: `AEGIS-${userEmail?.split('@')[0].toUpperCase().slice(0, 8)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-mono font-medium">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs leading-5 text-slate-500">
              Transfer any amount to these details from your bank. Funds typically arrive within 1–2 business hours.
              Card and mobile money top-ups coming soon.
            </p>
            <button onClick={() => setModal(null)} className="w-full rounded-xl border border-white/15 py-3 text-sm font-semibold hover:bg-white/[0.05] transition">
              Done
            </button>
          </div>
        </Modal>
      )}

      {/* Convert */}
      {modal === 'convert' && (
        <Modal
          title="Convert currency"
          subtitle="Swap between your wallet currencies at the real mid-market rate. No conversion fee."
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleConvert} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Convert from
              <select value={convertSourceId} onChange={(e) => setConvertSourceId(e.target.value)} className={selectCls}>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>{w.currency} · {formatMoney(w.balance, w.currency)}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Convert to
              <select value={convertTargetCurrency} onChange={(e) => setConvertTargetCurrency(e.target.value)} className={selectCls}>
                {currencies.filter((c) => c.code !== convertSourceCurrency).map((c) => (
                  <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Amount ({convertSourceCurrency})
              <input
                type="number" min="0.01" step="0.01" required
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
                placeholder="0.00"
                className={inputCls}
              />
            </label>
            <div className={rateCls}>
              <div className="flex justify-between text-slate-400"><span>Rate</span><span>1 {convertSourceCurrency} = {convertRate.toFixed(4)} {convertTargetCurrency}</span></div>
              <div className="flex justify-between font-medium"><span>You receive</span><span>{formatMoney(convertResult, convertTargetCurrency)}</span></div>
              <div className="flex justify-between text-slate-400"><span>Fee</span><span className="text-emerald-300">No conversion fee</span></div>
            </div>
            <button className="w-full rounded-xl bg-[#f4c653] py-3 text-sm font-bold text-[#221804] hover:bg-[#ffd875] transition">
              Convert now
            </button>
          </form>
        </Modal>
      )}

      {/* Card management */}
      {modal === 'card' && (
        <Modal
          title="Manage your card"
          subtitle="View card details and control spending settings."
          onClose={() => setModal(null)}
        >
          <div className="mt-6 space-y-4">
            {/* Mini card preview */}
            <div className="rounded-2xl bg-gradient-to-br from-[#d8a933] via-[#f4c653] to-[#fff0b1] p-5 text-[#1d1606] shadow-lg">
              <div className="flex justify-between text-[11px] font-bold tracking-[0.18em]">
                <span>AEGIS</span><span>VIRTUAL · MASTERCARD</span>
              </div>
              <p className="mt-8 font-mono text-lg tracking-[0.2em]">•••• {card?.last4 || '0000'}</p>
              <div className="mt-4 flex items-end justify-between text-[10px] font-semibold uppercase tracking-wider">
                <span>{displayName}</span><span>{card?.status || 'ACTIVE'}</span>
              </div>
            </div>
            {/* Details */}
            <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm">
              {[
                { label: 'Status',                   value: card?.status || 'ACTIVE' },
                { label: 'Type',                     value: 'Virtual · Mastercard' },
                { label: 'Foreign transaction fee',  value: 'None' },
                { label: 'Apple / Google Pay',       value: 'Supported' },
                { label: 'Spending limit',           value: 'No limit set' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-5 text-slate-400">
              🛡️ Physical card available on Pro and Elite plans — delivered worldwide in 5–10 business days.
            </p>
            <button onClick={() => setModal(null)} className="w-full rounded-xl border border-white/15 py-3 text-sm font-semibold hover:bg-white/[0.05] transition">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
