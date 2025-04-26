import { Router } from 'express'
import * as controller from '../controllers/account.controller'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.findAll)
router.get('/:id', controller.findOne)
router.delete('/:id', controller.remove)

export default router
