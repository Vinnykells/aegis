import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })

  const { name, targetAmount, currency = 'USD', targetDate } = await request.json()
  const amount = Number(targetAmount)

  if (typeof name !== 'string' || name.trim().length < 2 || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Enter a goal name and target amount.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .insert({ user_id: user.id, name: name.trim(), target_amount: amount, currency, target_date: targetDate || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ goal: data }, { status: 201 })
}
