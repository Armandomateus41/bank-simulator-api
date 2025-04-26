import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import accountRoutes from './routes/account.routes'
import transactionRoutes from './routes/transaction.routes'
import scheduleRoutes from './routes/schedule.routes'
import schedulerRoutes from './routes/scheduler.routes' // ⬅️ novo

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/accounts', accountRoutes)
app.use('/transactions', transactionRoutes)
app.use('/transactions/schedule', scheduleRoutes)
app.use('/scheduler', schedulerRoutes) // ⬅️ novo

app.get('/', (_req: Request, res: Response) => {
  res.send('Simulador de Sistema Bancário ✅')
})

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

export default app
