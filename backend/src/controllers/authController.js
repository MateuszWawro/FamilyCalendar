import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Walidacja
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email i hasło są wymagane' 
    });
  }

  try {
    // Znajdź użytkownika
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Nieprawidłowy email lub hasło' 
      });
    }

    // Sprawdź hasło
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Nieprawidłowy email lub hasło' 
      });
    }

    // Generuj JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Zwróć dane bez hasła
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (err) {
    console.error('Błąd logowania:', err);
    res.status(500).json({ 
      success: false,
      message: 'Błąd serwera' 
    });
  }
};

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  // Walidacja
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email i hasło są wymagane' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Hasło musi mieć minimum 6 znaków' 
    });
  }

  try {
    // Sprawdź czy użytkownik istnieje
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        success: false,
        message: 'Użytkownik o tym emailu już istnieje' 
      });
    }

    // Hashuj hasło
    const passwordHash = await bcrypt.hash(password, 10);

    // Utwórz użytkownika
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email.toLowerCase().trim(), passwordHash, name || null, 'user']
    );

    const user = result.rows[0];

    // Generuj JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });

  } catch (err) {
    console.error('Błąd rejestracji:', err);
    res.status(500).json({ 
      success: false,
      message: 'Błąd serwera' 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Użytkownik nie znaleziony' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Błąd pobierania profilu:', err);
    res.status(500).json({ 
      success: false,
      message: 'Błąd serwera' 
    });
  }
};