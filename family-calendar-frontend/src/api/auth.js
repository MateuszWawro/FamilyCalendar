import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from './db.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Brak email lub hasła' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    // Jeśli użytkownik nie istnieje
    if (!user) {
      return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' })
    }

    // Sprawdzenie hasła
    if (!user.password_hash) {
      return res.status(500).json({ message: 'Hasło nie ustawione dla tego użytkownika' })
    }

    const valid = bcrypt.compareSync(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' })
    }

    // Generowanie JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      user: { email: user.email, role: user.role },
      token
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Błąd serwera' })
  }
})

export default router