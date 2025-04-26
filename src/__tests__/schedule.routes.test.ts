import request from 'supertest'
import app from '../app'
import { prisma } from '../utils/prisma'

describe('Scheduler Routes - Integration', () => {
  let accountId: string

  beforeAll(async () => {
    const account = await prisma.account.create({
      data: {
        owner: 'User Scheduler',
        type: 'corrente',
        balance: 0
      }
    })

    accountId = account.id

    // Criar transação agendada pendente
    await prisma.transaction.create({
      data: {
        type: 'deposit',
        amount: 150,
        accountId,
        scheduledAt: new Date(Date.now() - 60_000), // no passado
        status: 'pending'
      }
    })
  })

  afterAll(async () => {
    await prisma.transaction.deleteMany({ where: { accountId } })
    await prisma.account.delete({ where: { id: accountId } })
    await prisma.$disconnect()
  })

  it('deve executar transações pendentes via POST /scheduler/run', async () => {
    const res = await request(app).post('/scheduler/run')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('executed')
    expect(res.body.executed.length).toBeGreaterThanOrEqual(1)
    expect(res.body.executed[0]).toHaveProperty('status', 'executed')
  })
})
