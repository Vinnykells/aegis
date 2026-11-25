import DashboardClient from '@/components/DashboardClient'
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

  return <DashboardClient
    userEmail={user.email}
    profile={profileResult.data}
    wallets={walletsResult.data || []}
    transfers={transfersResult.data || []}
    goals={goalsResult.data || []}
    card={cardsResult.data?.[0] || null}
  />
}
