import { Router } from 'express'
import {
  deposit,
  withdraw,
  transfer,
  statement,
} from '../controllers/transaction.controller'

const router = Router()

router.post('/deposit', deposit)
router.post('/withdraw', withdraw)
router.post('/transfer', transfer)
router.get('/:accountId', statement)

export default router
