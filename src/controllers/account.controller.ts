import { Request, Response, NextFunction } from 'express'
import * as service from '../services/account.service'
import { CreateAccountSchema } from '../validators/account.validator'

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = CreateAccountSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors })
      return
    }
    const account = await service.createAccount(parsed.data)
    res.status(201).json(account)
  } catch (err) {
    next(err)
  }
}

export const findAll = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accounts = await service.getAllAccounts()
    res.json(accounts)
  } catch (err) {
    next(err)
  }
}

export const findOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const account = await service.getAccountById(req.params.id)
    if (!account) {
      res.status(404).json({ error: 'Account not found' })
      return
    }
    res.json(account)
  } catch (err) {
    next(err)
  }
}

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await service.deleteAccount(req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
