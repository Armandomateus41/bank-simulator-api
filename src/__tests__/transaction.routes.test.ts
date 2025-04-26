import request from 'supertest'
import app from '../app'
import { prisma } from '../utils/prisma'

describe('Transaction Routes - Integration', () => {
  let fromAccountId: string
  let toAccountId: string

  beforeAll(async () => {
    // Cria duas contas para testar transferências
    const from = await prisma.account.create({
      data: { owner: 'User A', type: 'corrente', balance: 1000 },
    })
    const to = await prisma.account.create({
      data: { owner: 'User B', type: 'corrente', balance: 500 },
    })

    fromAccountId = from.id
    toAccountId = to.id
  })

  afterAll(async () => {
    await prisma.transaction.deleteMany({
      where: {
        OR: [{ accountId: fromAccountId }, { accountId: toAccountId }],
      },
    })

    await prisma.account.deleteMany({
      where: {
        id: { in: [fromAccountId, toAccountId] },
      },
    })

    await prisma.$disconnect()
  })

  it('deve realizar um depósito via POST /transactions/deposit', async () => {
    const res = await request(app).post('/transactions/deposit').send({
      accountId: fromAccountId,
      amount: 150,
      type: 'deposit',
    })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.amount).toBe(150)
  })

  it('deve realizar um saque via POST /transactions/withdraw', async () => {
    const res = await request(app).post('/transactions/withdraw').send({
      accountId: fromAccountId,
      amount: 100,
      type: 'withdraw',
    })

    expect(res.status).toBe(201)
    expect(res.body.amount).toBe(100)
  })

  it('deve realizar uma transferência via POST /transactions/transfer', async () => {
    const res = await request(app).post('/transactions/transfer').send({
      fromAccountId,
      toAccountId,
      amount: 200,
    })

    expect(res.status).toBe(201)
    expect(res.body.amount).toBe(200)
    expect(res.body.fromAccountId).toBe(fromAccountId)
    expect(res.body.toAccountId).toBe(toAccountId)
  })
})
