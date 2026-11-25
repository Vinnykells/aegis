'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthFrame from '@/components/AuthFrame'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { error: loginError } = await createClient().auth.signInWithPassword({ email, password })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthFrame
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Move, save, and protect your money from one secure place."
      footer={<><span>New to Aegis?</span> <Link href="/signup" className="font-medium text-amber-300 hover:text-amber-200">Create an account</Link></>}
    >
      {error && <p className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <label className="block"><span className="mb-2 block text-sm font-medium text-zinc-200">Email address</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="w-full rounded-xl border border-white/[0.1] bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10" /></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-zinc-200">Password</span><input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-white/[0.1] bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10" /></label>
        <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#f5c451] px-4 py-3 text-sm font-semibold text-[#211804] transition hover:bg-[#ffd36b] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing you in…' : 'Sign in to Aegis'}</button>
      </form>
    </AuthFrame>
  )
}
