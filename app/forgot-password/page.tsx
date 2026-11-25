'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#090b10] text-white flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        <Link href="/login" className="mb-10 inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-base text-[#1b1304] shadow-[0_8px_30px_rgba(245,158,11,0.28)]">A</span>
          Aegis
        </Link>

        {sent ? (
          <div>
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-2xl">✉️</div>
            <h1 className="text-3xl font-semibold tracking-[-0.045em]">Check your inbox</h1>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              We sent a password reset link to <span className="text-white font-medium">{email}</span>. Click the link in that email to set a new password.
            </p>
            <p className="mt-4 text-sm text-zinc-500">Didn't get it? Check your spam folder or{' '}
              <button onClick={() => setSent(false)} className="text-amber-300 hover:text-amber-200 font-medium">try again</button>.
            </p>
            <Link href="/login" className="mt-8 block text-center text-sm font-medium text-zinc-400 hover:text-white">
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Password reset</p>
            <h1 className="text-3xl font-semibold tracking-[-0.045em]">Forgot your password?</h1>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Enter your email and we'll send you a secure link to reset your password.
            </p>

            <div className="mt-9 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-1 shadow-2xl">
              <div className="rounded-[0.9rem] bg-[#10131b] p-5 sm:p-6">
                {error && <p className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-zinc-200">Email address</span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-white/[0.1] bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#f5c451] px-4 py-3 text-sm font-semibold text-[#211804] transition hover:bg-[#ffd36b] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Remember it?{' '}
              <Link href="/login" className="font-medium text-amber-300 hover:text-amber-200">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
