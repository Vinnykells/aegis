import { NextResponse, type NextRequest } from 'next/server'
import { getExchangeRate } from '@/utils/finance'
import { createClient } from '@/utils/supabase/server'

interface TransferBody {
  walletId?: string
  recipientName?: unknown
  recipientEmail?: unknown
  destinationCurrency?: string
  amount?: number | string
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })

  const { walletId, recipientName, recipientEmail, destinationCurrency, amount } = (await request.json()) as TransferBody
  const transferAmount = Number(amount)

  if (!walletId || typeof recipientName !== 'string' || recipientName.trim().length < 2 || !destinationCurrency || !Number.isFinite(transferAmount) || transferAmount <= 0) {
    return NextResponse.json({ error: 'Enter a recipient, destination currency, and valid amount.' }, { status: 400 })
  }

  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('currency')
    .eq('id', walletId)
    .single()

  if (walletError || !wallet) return NextResponse.json({ error: 'Wallet not found.' }, { status: 404 })

  const exchangeRate = getExchangeRate(wallet.currency, destinationCurrency)
  const fee = Math.max(0.5, transferAmount * 0.003)
  const convertedAmount = Number((transferAmount * exchangeRate).toFixed(2))

  const { data: transferId, error } = await supabase.rpc('create_consumer_transfer', {
    wallet_id: walletId,
    recipient: recipientName.trim(),
    recipient_address: typeof recipientEmail === 'string' ? recipientEmail.trim() || null : null,
    destination_currency_code: destinationCurrency,
    transfer_amount: transferAmount,
    converted_transfer_amount: convertedAmount,
    transfer_exchange_rate: exchangeRate,
    transfer_fee: fee,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ transferId, exchangeRate, convertedAmount, fee }, { status: 201 })
}
