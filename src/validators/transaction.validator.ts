import { z } from 'zod'

export const DepositSchema = z.object({
  type: z.literal('deposit'),
  accountId: z.string().uuid(),
  amount: z.number().positive(),
})

export const WithdrawSchema = z.object({
  type: z.literal('withdraw'),
  accountId: z.string().uuid(),
  amount: z.number().positive(),
})

export const TransferSchema = z.object({
  type: z.literal('transfer'),
  fromAccountId: z.string().uuid(),
  toAccountId: z.string().uuid(),
  amount: z.number().positive(),
})

export type DepositDTO = z.infer<typeof DepositSchema>
export type WithdrawDTO = z.infer<typeof WithdrawSchema>
export type TransferDTO = z.infer<typeof TransferSchema>
