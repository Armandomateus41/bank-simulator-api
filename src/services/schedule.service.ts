import { prisma } from '../utils/prisma'
import { ScheduleDTO } from '../validators/schedule.validator'

export async function scheduleTransaction(data: ScheduleDTO) {
  const { scheduledAt, ...rest } = data
  return prisma.transaction.create({
    data: {
      ...rest,
      scheduledAt: new Date(scheduledAt),
      status: 'pending',
      toAccountId: rest.type === 'transfer' ? rest.toAccountId : null,
    },
  })
}
