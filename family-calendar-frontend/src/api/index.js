import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import authRoutes from './auth.js'        // auth.js będzie mieć `export default router`
import { authenticateJWT } from './middleware.js'

const app = express()

// CORS dla frontendu Vite
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

// Trasy logowania
app.use('/login', authRoutes)

// Endpoint testowy chroniony JWT
app.get('/test', authenticateJWT, (req, res) => {
  res.json({ message: 'Token OK', user: req.user })
})

// Start serwera
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})