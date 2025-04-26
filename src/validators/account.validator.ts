import { z } from 'zod'

export const CreateAccountSchema = z.object({
  owner: z.string().min(1, 'O nome do titular é obrigatório'),
  type: z.enum(['corrente', 'poupanca', 'empresarial']),
  balance: z.number().nonnegative().default(0),
})

export type CreateAccountDTO = z.infer<typeof CreateAccountSchema>
