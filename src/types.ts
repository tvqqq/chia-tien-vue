export type ModalType = 'add' | 'edit'

export interface ParticipantType {
  id: number
  name: string
}

export interface ExpenseType {
  id: string
  title: string
  amount: number
  avg_amount?: number
  payer: number
  beneficiaries: number[]
}

export interface BalanceType {
  participant_id: number
  payAmount: number
  consumeAmount: number
  balance: number
}
