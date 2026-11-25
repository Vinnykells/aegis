export interface Profile {
  full_name: string | null
  country_code: string | null
}

export interface Wallet {
  id: string
  user_id: string
  currency: string
  balance: number | string
  is_primary: boolean
  created_at: string
}

export type TransferStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface Transfer {
  id: string
  user_id: string
  source_wallet_id: string
  recipient_name: string
  recipient_email: string | null
  destination_currency: string
  destination_currency_code?: string
  amount: number | string
  converted_amount: number | string
  exchange_rate: number | string
  fee: number | string
  reference: string
  status: TransferStatus
  created_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number | string
  current_amount: number | string
  currency: string
  target_date: string | null
  created_at: string
}

export type CardType = 'VIRTUAL' | 'PHYSICAL'
export type CardStatus = 'ACTIVE' | 'FROZEN' | 'CANCELLED'

export interface Card {
  id: string
  user_id: string
  card_type: CardType
  last4: string
  currency: string
  status: CardStatus
  created_at: string
}
