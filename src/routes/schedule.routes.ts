import { Router } from 'express'
import { runScheduler } from '../controllers/scheduler.controller'

const router = Router()

// Endpoint: POST /scheduler/run
router.post('/run', runScheduler)

export default router
