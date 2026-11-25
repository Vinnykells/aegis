'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthFrame from '@/components/AuthFrame'
import { createClient } from '@/utils/supabase/client'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setNotice(null)

    const { data, error: signupError } = await createClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (!data.session) {
      setNotice('Check your inbox to confirm your email. Your Aegis account will be ready as soon as you return.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthFrame
      eyebrow="Create your account"
      title="Start with a clearer view of money."
      description="Set up your Aegis account in minutes, then send, save, and spend globally with confidence."
      footer={<><span>Already have an account?</span> <Link href="/login" className="font-medium text-amber-300 hover:text-amber-200">Sign in</Link></>}
    >
      {error && <p className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}
      {notice && <p className="mb-5 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2.5 text-sm text-amber-100">{notice}</p>}
      <form onSubmit={handleSignup} className="space-y-4">
        <label className="block"><span className="mb-2 block text-sm font-medium text-zinc-200">Full name or company</span><input type="text" required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Aegis Studio" className="w-full rounded-xl border border-white/[0.1] bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10" /></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-zinc-200">Email</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="w-full rounded-xl border border-white/[0.1] bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10" /></label>
        <label className="block"><span className="mb-2 block text-sm font-medium text-zinc-200">Create password</span><input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="w-full rounded-xl border border-white/[0.1] bg-black/20 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10" /></label>
        <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#f5c451] px-4 py-3 text-sm font-semibold text-[#211804] transition hover:bg-[#ffd36b] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Creating account…' : 'Create your Aegis account'}</button>
      </form>
      <p className="mt-5 text-center text-xs leading-5 text-zinc-500">By continuing, you agree to Aegis’ Terms of Service and Privacy Policy.</p>
    </AuthFrame>
  )
}
