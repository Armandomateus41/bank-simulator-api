import { prisma } from '../utils/prisma'
import {
  DepositDTO,
  TransferDTO,
  WithdrawDTO,
} from '../validators/transaction.validator'

export async function deposit(data: DepositDTO) {
  const { accountId, amount } = data

  const account = await prisma.account.findUnique({ where: { id: accountId } })
  if (!account) throw new Error('Conta não encontrada')

  const updatedAccount = await prisma.account.update({
    where: { id: accountId },
    data: { balance: account.balance + amount },
  })

  const tx = await prisma.transaction.create({
    data: {
      type: 'deposit',
      amount,
      accountId,
    },
  })

  return {
    ...tx,
    newBalance: updatedAccount.balance,
  }
}

export async function withdraw(data: WithdrawDTO) {
  const { accountId, amount } = data

  const account = await prisma.account.findUnique({ where: { id: accountId } })
  if (!account) throw new Error('Conta não encontrada')
  if (account.balance < amount) throw new Error('Saldo insuficiente')

  const updatedAccount = await prisma.account.update({
    where: { id: accountId },
    data: { balance: account.balance - amount },
  })

  const tx = await prisma.transaction.create({
    data: {
      type: 'withdraw',
      amount,
      accountId,
    },
  })

  return {
    ...tx,
    newBalance: updatedAccount.balance,
  }
}

export async function transfer(data: TransferDTO) {
  const { fromAccountId, toAccountId, amount } = data

  if (fromAccountId === toAccountId) throw new Error('Contas devem ser diferentes')

  const from = await prisma.account.findUnique({ where: { id: fromAccountId } })
  const to = await prisma.account.findUnique({ where: { id: toAccountId } })
  if (!from || !to) throw new Error('Conta origem ou destino não encontrada')
  if (from.balance < amount) throw new Error('Saldo insuficiente')

  await prisma.account.update({
    where: { id: fromAccountId },
    data: { balance: from.balance - amount },
  })

  await prisma.account.update({
    where: { id: toAccountId },
    data: { balance: to.balance + amount },
  })

  const tx = await prisma.transaction.create({
    data: {
      type: 'transfer',
      amount,
      accountId: fromAccountId,
      toAccountId,
    },
  })

  return {
    ...tx,
    fromBalance: from.balance - amount,
    toBalance: to.balance + amount,
  }
}
