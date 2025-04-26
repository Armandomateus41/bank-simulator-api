import request from 'supertest'
import app from '../app'
import { prisma } from '../utils/prisma'

describe('Account Routes - Integration', () => {
  let accountId: string

  afterAll(async () => {
    if (accountId) {
      await prisma.account.delete({ where: { id: accountId } })
    }
    await prisma.$disconnect()
  })

  it('deve criar uma nova conta via POST /accounts', async () => {
    const res = await request(app).post('/accounts').send({
      owner: 'João da Rota',
      type: 'corrente',
      balance: 200,
    })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.owner).toBe('João da Rota')

    accountId = res.body.id
  })

  it('deve retornar a conta criada via GET /accounts/:id', async () => {
    const res = await request(app).get(`/accounts/${accountId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(accountId)
    expect(res.body.owner).toBe('João da Rota')
  })
})
