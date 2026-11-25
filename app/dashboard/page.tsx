import DashboardClient from '@/components/DashboardClient'
import type { Card, Profile, SavingsGoal, Transfer, Wallet } from '@/types'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, walletsResult, transfersResult, goalsResult, cardsResult] = await Promise.all([
    supabase.from('profiles').select('full_name, country_code').eq('id', user.id).maybeSingle(),
    supabase.from('wallets').select('*').order('is_primary', { ascending: false }).order('created_at'),
    supabase.from('transfers').select('*').order('created_at', { ascending: false }).limit(8),
    supabase.from('savings_goals').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('cards').select('*').order('created_at').limit(1),
  ])

  return (
    <DashboardClient
      userEmail={user.email ?? ''}
      profile={(profileResult.data as Profile | null) ?? null}
      wallets={(walletsResult.data as Wallet[] | null) ?? []}
      transfers={(transfersResult.data as Transfer[] | null) ?? []}
      goals={(goalsResult.data as SavingsGoal[] | null) ?? []}
      card={(cardsResult.data?.[0] as Card | undefined) ?? null}
    />
  )
}
