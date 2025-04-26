import { prisma } from '../utils/prisma'
import * as service from '../services/account.service'

describe('Account Service', () => {
  it('deve criar conta com saldo inicial zero quando balance for 0', async () => {
    // Agora passamos explicitamente balance: 0
    const acc = await service.createAccount({
      owner: 'Teste',
      type: 'corrente',
      balance: 0,
    })
    expect(acc.balance).toBe(0)

    // Limpeza do dado criado no banco
    await prisma.account.delete({ where: { id: acc.id } })
  })
})
