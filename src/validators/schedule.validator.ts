import { z } from 'zod'

export const ScheduleSchema = z.object({
  accountId:   z.string().uuid(),
  type:        z.enum(['deposit', 'withdraw', 'transfer']),
  amount:      z.number().positive(),
  scheduledAt: z.string().refine((s) => !isNaN(Date.parse(s)), {
    message: 'scheduledAt deve ser data ISO válida',
  }),
  toAccountId: z.string().uuid().optional(),
})

export type ScheduleDTO = z.infer<typeof ScheduleSchema>
