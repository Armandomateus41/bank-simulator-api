import cron from 'node-cron'
import { prisma } from '../utils/prisma'
import * as txService from '../services/transaction.service'

export async function processScheduledTransactions() {
  const pendings = await prisma.transaction.findMany({
    where: {
      scheduledAt: { lte: new Date() },
      status: 'pending'
    }
  })

  const executed = []

  for (const t of pendings) {
    try {
      if (t.type === 'deposit') {
        await txService.deposit({
          accountId: t.accountId,
          amount: t.amount,
          type: 'deposit',
        })
      } else if (t.type === 'withdraw') {
        await txService.withdraw({
          accountId: t.accountId,
          amount: t.amount,
          type: 'withdraw',
        })
      } else if (t.type === 'transfer' && t.toAccountId) {
        await txService.transfer({
          fromAccountId: t.accountId,
          toAccountId: t.toAccountId,
          amount: t.amount,
        })
      }

      const updated = await prisma.transaction.update({
        where: { id: t.id },
        data: { status: 'executed' },
      })

      executed.push(updated)

    } catch (err) {
      console.error('Erro ao executar agendado', t.id, err)
      await prisma.transaction.update({
        where: { id: t.id },
        data: { status: 'failed' },
      })
    }
  }

  return executed
}

// Agenda automática a cada minuto
cron.schedule('* * * * *', processScheduledTransactions)
