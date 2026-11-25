import { NextResponse, type NextRequest } from 'next/server'
import { getExchangeRate } from '@/utils/finance'
import { createClient } from '@/utils/supabase/server'

interface ConvertBody {
  sourceWalletId?: string
  targetCurrency?: string
  amount?: number | string
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })

  const { sourceWalletId, targetCurrency, amount } = (await request.json()) as ConvertBody
  const convertAmount = Number(amount)

  if (!sourceWalletId || !targetCurrency || !Number.isFinite(convertAmount) || convertAmount <= 0) {
    return NextResponse.json({ error: 'Provide a source wallet, target currency, and valid amount.' }, { status: 400 })
  }

  // Fetch and validate source wallet
  const { data: sourceWallet, error: srcError } = await supabase
    .from('wallets')
    .select('id, currency, balance')
    .eq('id', sourceWalletId)
    .eq('user_id', user.id)
    .single()

  if (srcError || !sourceWallet) {
    return NextResponse.json({ error: 'Source wallet not found.' }, { status: 404 })
  }

  if (Number(sourceWallet.balance) < convertAmount) {
    return NextResponse.json({ error: 'Insufficient balance for this conversion.' }, { status: 400 })
  }

  if (sourceWallet.currency === targetCurrency) {
    return NextResponse.json({ error: 'Source and target currencies must be different.' }, { status: 400 })
  }

  const rate             = getExchangeRate(sourceWallet.currency, targetCurrency)
  const convertedAmount  = Number((convertAmount * rate).toFixed(2))
  const newSourceBalance = Number((Number(sourceWallet.balance) - convertAmount).toFixed(2))

  // Deduct from source wallet
  const { error: deductError } = await supabase
    .from('wallets')
    .update({ balance: newSourceBalance })
    .eq('id', sourceWalletId)
    .eq('user_id', user.id)

  if (deductError) return NextResponse.json({ error: deductError.message }, { status: 400 })

  // Find or create destination wallet
  const { data: destWallet } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', user.id)
    .eq('currency', targetCurrency)
    .maybeSingle()

  if (destWallet) {
    const newDestBalance = Number((Number(destWallet.balance) + convertedAmount).toFixed(2))
    await supabase.from('wallets').update({ balance: newDestBalance }).eq('id', destWallet.id)
  } else {
    await supabase.from('wallets').insert({
      user_id:    user.id,
      currency:   targetCurrency,
      balance:    convertedAmount,
      is_primary: false,
    })
  }

  return NextResponse.json({ rate, convertedAmount, sourceCurrency: sourceWallet.currency, targetCurrency }, { status: 200 })
}
