'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
  const router                  = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [ready, setReady]       = useState(false)

  // Supabase embeds the tokens in the URL hash — wait for the session to establish
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    setError(null)

    const { error: updateError } = await createClient().auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#090b10] text-white flex items-center justify-center px-5">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-amber-400" />
          <p className="text-sm text-zinc-400">Verifying your reset link…</p>
          <p className="mt-3 text-xs text-zinc-600">
            If nothing happens, your link may have expired.{' '}
            <Link href="/forgot-password" className="text-amber-300">Request a new one</Link>.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#090b10] text-white flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-10 inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-base text-[#1b1304] shadow-[0_8px_30px_rgba(245,158,11,0.28)]">A</span>
          Aegis
        </Link>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">New password</p>
        <h1 className="text-3xl font-semibold tracking-[-0.045em]">Set a new password</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-400">Choose something strong. At least 6 characters.</p>

        <div className="mt-9 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-1 shadow-2xl">
          <div className="rounded-[0.9rem] bg-[#10131b] p-5 sm:p-6">
            {error && <p className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-200">New password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-white/[0.1] bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-200">Confirm password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Same password again"
                  className="w-full rounded-xl border border-white/[0.1] bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#f5c451] px-4 py-3 text-sm font-semibold text-[#211804] transition hover:bg-[#ffd36b] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
