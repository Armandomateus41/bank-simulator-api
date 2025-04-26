import { prisma } from '../utils/prisma'
import * as service from '../services/schedule.service'

describe('Schedule Service', () => {
  let accountId: string

  beforeAll(async () => {
    // Cria uma conta para agendamento
    const acc = await prisma.account.create({
      data: { owner: 'Sched Test', type: 'corrente', balance: 0 },
    })
    accountId = acc.id
  })

  afterAll(async () => {
    // Limpa transações agendadas e a conta
    await prisma.transaction.deleteMany({ where: { accountId } })
    await prisma.account.delete({ where: { id: accountId } })
    await prisma.$disconnect()
  })

  it('deve criar uma transação agendada com status pending', async () => {
    const future = new Date(Date.now() + 60_000).toISOString() // daqui a 1 min
    const dto = {
      accountId,
      type: 'deposit' as const,
      amount: 25,
      scheduledAt: future,
    }
    const tx = await service.scheduleTransaction(dto)

    expect(tx.accountId).toBe(accountId)
    expect(tx.amount).toBe(25)
    expect(tx.status).toBe('pending')
    // Usamos ! para garantir ao TS que scheduledAt não é null
    expect(tx.scheduledAt!.toISOString()).toBe(future)
  })
})
