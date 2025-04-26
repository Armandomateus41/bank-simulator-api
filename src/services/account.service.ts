import { prisma } from '../utils/prisma'
import { CreateAccountDTO } from '../validators/account.validator'

export const createAccount = (data: CreateAccountDTO) => {
  return prisma.account.create({ data })
}

export const getAllAccounts = () => {
  return prisma.account.findMany()
}

export const getAccountById = (id: string) => {
  return prisma.account.findUnique({ where: { id } })
}

export const deleteAccount = (id: string) => {
  return prisma.account.delete({ where: { id } })
}
