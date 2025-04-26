import { RequestHandler } from 'express'
import * as txService from '../services/transaction.service'
import { DepositSchema, TransferSchema, WithdrawSchema } from '../validators/transaction.validator'

export const deposit: RequestHandler = async (req, res, next) => {
  try {
    const data = DepositSchema.parse(req.body)
    const tx = await txService.deposit(data)
    res.status(201).json(tx)
  } catch (err) {
    next(err)
  }
}

export const withdraw: RequestHandler = async (req, res, next) => {
  try {
    const data = WithdrawSchema.parse(req.body)
    const tx = await txService.withdraw(data)
    res.status(201).json(tx)
  } catch (err) {
    next(err)
  }
}

export const transfer: RequestHandler = async (req, res, next) => {
  try {
    const data = TransferSchema.parse(req.body)
    const tx = await txService.transfer(data)
    
    // Retorno mais completo para os testes
    res.status(201).json({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      fromAccountId: data.fromAccountId,
      toAccountId: data.toAccountId,
      status: 'executed',
      createdAt: tx.createdAt,
    })
  } catch (err) {
    next(err)
  }
}

export const statement: RequestHandler = async (req, res, next) => {
  try {
    const { accountId } = req.params
    const transactions = await txService.getStatement(accountId)
    res.json(transactions)
  } catch (err) {
    next(err)
  }
}
