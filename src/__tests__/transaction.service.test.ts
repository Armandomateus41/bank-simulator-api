import { prisma } from '../utils/prisma'
import * as txService from '../services/transaction.service'
import { v4 as uuid } from 'uuid'

describe('Transaction Service', () => {
  let accountId: string
  let otherAccountId: string

  beforeAll(async () => {
    // Cria duas contas para testar depósito, saque e transferência
    const acc1 = await prisma.account.create({
      data: { owner: 'Tx User 1', type: 'corrente', balance: 100 },
    })
    const acc2 = await prisma.account.create({
      data: { owner: 'Tx User 2', type: 'corrente', balance: 0 },
    })
    accountId = acc1.id
    otherAccountId = acc2.id
  })

  afterAll(async () => {
    // Limpa dados
    await prisma.transaction.deleteMany({ where: { accountId } })
    await prisma.transaction.deleteMany({ where: { accountId: otherAccountId } })
    await prisma.account.delete({ where: { id: accountId } })
    await prisma.account.delete({ where: { id: otherAccountId } })
    await prisma.$disconnect()
  })

  it('deve fazer depósito corretamente', async () => {
    const tx = await txService.deposit({ accountId, amount: 50, type: 'deposit' })
    expect(tx.type).toBe('deposit')
    const acc = await prisma.account.findUniqueOrThrow({ where: { id: accountId } })
    expect(acc.balance).toBe(150)
  })

  it('deve impedir saque por saldo insuficiente', async () => {
    await expect(
      txService.withdraw({ accountId, amount: 200, type: 'withdraw' })
    ).rejects.toThrow('Saldo insuficiente')
  })

  it('deve realizar transferência entre contas', async () => {
    // garante saldo suficiente
    await txService.deposit({ accountId, amount: 100, type: 'deposit' })
    const tx = await txService.transfer({
      fromAccountId: accountId,
      toAccountId: otherAccountId,
      amount: 50,
    })
    expect(tx.type).toBe('transfer')
    const acc1 = await prisma.account.findUniqueOrThrow({ where: { id: accountId } })
    const acc2 = await prisma.account.findUniqueOrThrow({ where: { id: otherAccountId } })
    expect(acc1.balance).toBe(200)  // 150 + 100 -50
    expect(acc2.balance).toBe(50)
  })
})
