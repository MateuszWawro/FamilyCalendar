import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Brak tokena' })

  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Niepoprawny token' })
  }
}