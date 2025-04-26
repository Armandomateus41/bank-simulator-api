import { Request, Response, NextFunction } from 'express'
import { processScheduledTransactions } from '../schedulers/transaction.scheduler'

export async function runScheduler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const executed = await processScheduledTransactions()
    res.status(200).json({ executed })
  } catch (err) {
    next(err)
  }
}
