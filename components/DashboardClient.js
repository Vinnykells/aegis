'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { currencies, formatMoney, getExchangeRate } from '@/utils/finance'
import { createClient } from '@/utils/supabase/client'

async function api(path, options) {
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error || 'Something went wrong.')
  return payload
}

function initials(value) {
  return value?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'A'
}

function currencyMeta(code) {
  return currencies.find((currency) => currency.code === code) || { code, name: code, symbol: code }
}

function Modal({ title, subtitle, onClose, children }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#07111d]/55 p-4 backdrop-blur-sm" onMouseDown={onClose}><div className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-[#101722] p-6 text-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Aegis</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{title}</h2>{subtitle && <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>}</div><button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.07] text-slate-300">×</button></div>{children}</div></div>
}

export default function DashboardClient({ userEmail, profile, wallets, transfers, goals, card }) {
  const router = useRouter()
  const [modal, setModal] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [sourceWalletId, setSourceWalletId] = useState(wallets[0]?.id || '')
  const [destinationCurrency, setDestinationCurrency] = useState('NGN')
  const [amount, setAmount] = useState('')
  const [goalName, setGoalName] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [goalCurrency, setGoalCurrency] = useState('USD')
  const primaryWallet = wallets.find((wallet) => wallet.is_primary) || wallets[0]
  const sourceWallet = wallets.find((wallet) => wallet.id === sourceWalletId) || primaryWallet
  const sourceCurrency = sourceWallet?.currency || 'USD'
  const exchangeRate = getExchangeRate(sourceCurrency, destinationCurrency)
  const convertedAmount = Number(amount || 0) * exchangeRate
  const displayName = profile?.full_name || userEmail?.split('@')[0] || 'there'
  const totalBalance = primaryWallet?.balance || 0

  const recentRates = useMemo(() => currencies.filter((currency) => currency.code !== sourceCurrency).slice(0, 4), [sourceCurrency])

  const completeAction = async (action, successMessage) => {
    setError('')
    setNotice('')
    try {
      await action()
      setNotice(successMessage)
      setModal(null)
      router.refresh()
    } catch (actionError) {
      setError(actionError.message)
    }
  }

  const handleTransfer = (event) => {
    event.preventDefault()
    completeAction(async () => {
      await api('/api/transfers', { method: 'POST', body: JSON.stringify({ walletId: sourceWalletId, recipientName, recipientEmail, destinationCurrency, amount }) })
      setRecipientName('')
      setRecipientEmail('')
      setAmount('')
    }, 'Transfer created. You can track it below.')
  }

  const handleGoal = (event) => {
    event.preventDefault()
    completeAction(async () => {
      await api('/api/savings', { method: 'POST', body: JSON.stringify({ name: goalName, targetAmount: goalAmount, currency: goalCurrency }) })
      setGoalName('')
      setGoalAmount('')
    }, 'Savings goal created.')
  }

  const signOut = async () => {
    await createClient().auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  return <div className="min-h-screen bg-[#07111d] text-white">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(83,153,255,0.17),transparent_30%),radial-gradient(circle_at_0%_30%,rgba(245,158,11,0.10),transparent_24%)]" />
    <header className="relative border-b border-white/[0.08] bg-[#07111d]/75 backdrop-blur-xl"><div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><a href="/" className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 text-sm text-[#1e1605] shadow-lg shadow-amber-500/20">A</span>Aegis</a><nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex"><a href="#home" className="text-white">Home</a><a href="#activity" className="hover:text-white">Activity</a><a href="#savings" className="hover:text-white">Savings</a><a href="#card" className="hover:text-white">Card</a></nav><div className="flex items-center gap-3"><button onClick={() => setModal('send')} className="rounded-lg bg-[#f4c653] px-3.5 py-2 text-xs font-bold text-[#221804] transition hover:bg-[#ffd875]">Send money</button><button onClick={signOut} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-[11px] font-bold text-amber-200" title="Sign out">{initials(displayName)}</button></div></div></header>

    <main id="home" className="relative mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-12"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm text-slate-400">Tuesday, 24 November</p><h1 className="mt-1 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">Hello, {displayName.split(' ')[0]}.</h1></div><button onClick={() => setModal('add-money')} className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/[0.1]">＋ Add money</button></div>
      {(error || notice) && <p className={`mt-6 rounded-xl border px-4 py-3 text-sm ${error ? 'border-red-400/25 bg-red-400/10 text-red-100' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'}`}>{error || notice}</p>}

      <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]"><div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-[#1c2d47] via-[#14243a] to-[#101924] p-6 shadow-2xl shadow-black/25 sm:p-8"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" /><div className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-amber-300/15 blur-3xl" /><div className="relative"><div className="flex items-center justify-between"><p className="text-sm text-slate-300">Total balance</p><span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-[11px] text-slate-300">Personal account</span></div><p className="mt-8 text-4xl font-medium tracking-[-0.065em] sm:text-5xl">{formatMoney(totalBalance, primaryWallet?.currency || 'USD')}</p><p className="mt-3 text-sm text-slate-400">Your primary wallet balance</p><div className="mt-9 grid grid-cols-3 gap-2 sm:max-w-md sm:gap-3"><button onClick={() => setModal('send')} className="rounded-xl bg-[#f4c653] px-3 py-3 text-sm font-semibold text-[#241905]">↑ <span className="hidden sm:inline">Send</span></button><button onClick={() => setModal('add-money')} className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-3 text-sm font-medium text-white hover:bg-white/[0.1]">↓ <span className="hidden sm:inline">Add</span></button><button onClick={() => setModal('convert')} className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-3 text-sm font-medium text-white hover:bg-white/[0.1]">↻ <span className="hidden sm:inline">Convert</span></button></div></div></div>
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101924] p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Your Aegis card</p><p className="mt-1 text-xs text-slate-400">Ready for global spending</p></div><span className="text-xl text-amber-300">◒</span></div><div id="card" className="mt-6 rounded-2xl bg-gradient-to-br from-[#d8a933] via-[#f4c653] to-[#fff0b1] p-5 text-[#1d1606] shadow-lg"><div className="flex justify-between text-[11px] font-bold tracking-[0.18em]"><span>AEGIS</span><span>VIRTUAL</span></div><p className="mt-11 font-mono text-lg tracking-[0.2em]">•••• {card?.last4 || '0000'}</p><div className="mt-5 flex items-end justify-between text-[10px] font-semibold uppercase tracking-wider"><span>{displayName}</span><span>{card?.status || 'ACTIVE'}</span></div></div><button className="mt-5 text-sm font-semibold text-amber-300">Manage card →</button></div></section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]"><div className="rounded-[1.5rem] border border-white/10 bg-[#101924] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold tracking-[-0.02em]">Your wallets</h2><p className="mt-1 text-xs text-slate-400">Hold and move money in multiple currencies</p></div><button onClick={() => setModal('add-money')} className="text-xs font-semibold text-amber-300">Add currency</button></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{wallets.map((wallet) => { const meta = currencyMeta(wallet.currency); return <div key={wallet.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"><div className="flex items-start justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.08] text-xs font-bold text-slate-200">{meta.code}</span>{wallet.is_primary && <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">Primary</span>}</div><p className="mt-5 text-sm text-slate-400">{meta.name}</p><p className="mt-1 text-xl font-semibold tracking-[-0.04em]">{formatMoney(wallet.balance, wallet.currency)}</p></div>})}</div></div>
      <div className="rounded-[1.5rem] border border-white/10 bg-[#101924] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold tracking-[-0.02em]">Live exchange</h2><p className="mt-1 text-xs text-slate-400">Mid-market indicative rates</p></div><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">Live</span></div><div className="mt-5 space-y-3">{recentRates.map((currency) => <div key={currency.code} className="flex items-center justify-between rounded-xl bg-white/[0.035] px-3 py-3"><div><p className="text-sm font-medium">{sourceCurrency} → {currency.code}</p><p className="mt-1 text-xs text-slate-500">1 {sourceCurrency} = {getExchangeRate(sourceCurrency, currency.code).toFixed(2)} {currency.code}</p></div><span className="text-xs font-medium text-emerald-300">+0.2%</span></div>)}</div></div></section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]"><div id="activity" className="rounded-[1.5rem] border border-white/10 bg-[#101924]"><div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5 sm:px-6"><div><h2 className="font-semibold tracking-[-0.02em]">Recent activity</h2><p className="mt-1 text-xs text-slate-400">Every transfer in one place</p></div><button className="text-xs font-semibold text-amber-300">See all</button></div>{transfers.length ? <div className="divide-y divide-white/[0.07]">{transfers.map((transfer) => <div key={transfer.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-400/10 text-blue-200">↑</span><div className="min-w-0"><p className="truncate text-sm font-medium">To {transfer.recipient_name}</p><p className="mt-1 text-xs text-slate-500">{new Date(transfer.created_at).toLocaleDateString()} · {transfer.reference}</p></div></div><div className="text-right"><p className="text-sm font-medium">−{formatMoney(transfer.amount, sourceCurrency)}</p><p className={`mt-1 text-[11px] font-semibold ${transfer.status === 'COMPLETED' ? 'text-emerald-300' : 'text-amber-300'}`}>{transfer.status}</p></div></div>)}</div> : <div className="px-6 py-14 text-center"><span className="grid mx-auto h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-slate-400">↗</span><p className="mt-4 text-sm font-medium">Your activity will appear here</p><p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">Make your first transfer when you are ready.</p><button onClick={() => setModal('send')} className="mt-5 text-sm font-semibold text-amber-300">Send money →</button></div>}</div>
      <div id="savings" className="rounded-[1.5rem] border border-white/10 bg-[#101924] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold tracking-[-0.02em]">Savings</h2><p className="mt-1 text-xs text-slate-400">Build toward what matters</p></div><button onClick={() => setModal('goal')} className="text-xs font-semibold text-amber-300">New goal</button></div><div className="mt-5 space-y-4">{goals.length ? goals.map((goal) => { const percent = Math.min(100, Number(goal.current_amount) / Number(goal.target_amount) * 100); return <div key={goal.id}><div className="flex justify-between text-sm"><span>{goal.name}</span><span className="text-slate-400">{Math.round(percent)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-200" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-xs text-slate-500">{formatMoney(goal.current_amount, goal.currency)} of {formatMoney(goal.target_amount, goal.currency)}</p></div> }) : <div className="rounded-2xl border border-dashed border-white/10 px-4 py-9 text-center"><p className="text-sm font-medium">Save with intention</p><p className="mt-2 text-xs leading-5 text-slate-500">Set a goal for travel, a home, or your next big move.</p><button onClick={() => setModal('goal')} className="mt-4 text-sm font-semibold text-amber-300">Create a goal →</button></div>}</div></div></section>
    </main>

    {modal === 'send' && <Modal title="Send money" subtitle="Securely send from your Aegis wallet to anyone, anywhere." onClose={() => setModal(null)}><form onSubmit={handleTransfer} className="mt-6 space-y-4"><label className="block text-sm font-medium">Send from<select value={sourceWalletId} onChange={(event) => setSourceWalletId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none">{wallets.map((wallet) => <option key={wallet.id} value={wallet.id} className="bg-[#101722]">{wallet.currency} · {formatMoney(wallet.balance, wallet.currency)}</option>)}</select></label><label className="block text-sm font-medium">Recipient name<input required value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="Who are you sending to?" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-amber-300" /></label><label className="block text-sm font-medium">Recipient email <span className="font-normal text-slate-500">optional</span><input type="email" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} placeholder="recipient@email.com" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-amber-300" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium">Amount<input type="number" min="0.01" step="0.01" required value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-amber-300" /></label><label className="block text-sm font-medium">Recipient gets<select value={destinationCurrency} onChange={(event) => setDestinationCurrency(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none">{currencies.map((currency) => <option key={currency.code} value={currency.code} className="bg-[#101722]">{currency.code}</option>)}</select></label></div><div className="rounded-xl bg-white/[0.05] p-4 text-sm"><div className="flex justify-between text-slate-400"><span>Rate</span><span>1 {sourceCurrency} = {exchangeRate.toFixed(4)} {destinationCurrency}</span></div><div className="mt-2 flex justify-between text-slate-400"><span>Recipient gets</span><span>{formatMoney(convertedAmount, destinationCurrency)}</span></div><div className="mt-2 flex justify-between font-medium"><span>Transfer fee</span><span>{formatMoney(Math.max(0.5, Number(amount || 0) * 0.003), sourceCurrency)}</span></div></div><button className="w-full rounded-xl bg-[#f4c653] py-3 text-sm font-bold text-[#221804]">Review transfer</button></form></Modal>}
    {modal === 'goal' && <Modal title="Create a savings goal" subtitle="Give your money a purpose and watch your progress build." onClose={() => setModal(null)}><form onSubmit={handleGoal} className="mt-6 space-y-4"><label className="block text-sm font-medium">Goal name<input required value={goalName} onChange={(event) => setGoalName(event.target.value)} placeholder="Trip to London" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-amber-300" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium">Target amount<input type="number" min="1" required value={goalAmount} onChange={(event) => setGoalAmount(event.target.value)} placeholder="5,000" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-amber-300" /></label><label className="block text-sm font-medium">Currency<select value={goalCurrency} onChange={(event) => setGoalCurrency(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-sm outline-none">{currencies.map((currency) => <option key={currency.code} value={currency.code} className="bg-[#101722]">{currency.code}</option>)}</select></label></div><button className="w-full rounded-xl bg-[#f4c653] py-3 text-sm font-bold text-[#221804]">Create savings goal</button></form></Modal>}
    {modal === 'add-money' && <Modal title="Add money" subtitle="Secure account funding is the next connection being added to your Aegis wallet." onClose={() => setModal(null)}><div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">Your wallet and transfer history are ready. Bank, card, and mobile-money deposit rails need your selected payment-provider credentials before we can safely activate real deposits.</div><button onClick={() => setModal(null)} className="mt-5 w-full rounded-xl border border-white/15 py-3 text-sm font-semibold">Got it</button></Modal>}
    {modal === 'convert' && <Modal title="Convert currency" subtitle="Currency conversion will use the same verified funding and settlement rails as transfers." onClose={() => setModal(null)}><div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">Live indicative rates are shown above. Conversion settlement is held until the funding rails are connected, so no customer balance is moved prematurely.</div><button onClick={() => setModal(null)} className="mt-5 w-full rounded-xl border border-white/15 py-3 text-sm font-semibold">Close</button></Modal>}
  </div>
}
