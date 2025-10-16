import pool from '../config/database.js';

// GET /api/events
export const getEvents = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM events WHERE user_id = $1 ORDER BY date ASC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    console.error('Błąd pobierania wydarzeń:', err);
    res.status(500).json({ 
      success: false,
      message: 'Błąd serwera' 
    });
  }
};

// POST /api/events
export const createEvent = async (req, res) => {
  const { title, date, color, description } = req.body;

  // Walidacja
  if (!title || !date) {
    return res.status(400).json({ 
      success: false,
      message: 'Tytuł i data są wymagane' 
    });
  }

  // Walidacja daty
  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime())) {
    return res.status(400).json({ 
      success: false,
      message: 'Nieprawidłowy format daty' 
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO events (user_id, title, date, color, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, date, color || 'event-mama', description || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Błąd tworzenia wydarzenia:', err);
    res.status(500).json({ 
      success: false,
      message: 'Błąd serwera' 
    });
  }
};

// PUT /api/events/:id
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, date, color, description } = req.body;

  try {
    // Sprawdź czy wydarzenie należy do użytkownika
    const checkResult = await pool.query(
      'SELECT id FROM events WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Wydarzenie nie znalezione' 
      });
    }

    const result = await pool.query(
      'UPDATE events SET title = COALESCE($1, title), date = COALESCE($2, date), color = COALESCE($3, color), description = COALESCE($4, description), updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, date, color, description, id, req.user.id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Błąd aktualizacji wydarzenia:', err);
    res.status(500).json({ 
      success: false,
      message: 'Błąd serwera' 
    });
  }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Wydarzenie nie znalezione' 
      });
    }

    res.json({
      success: true,
      message: 'Wydarzenie usunięte'
    });

  } catch (err) {
    console.error('Błąd usuwania wydarzenia:', err);
    res.status(500).json({ 
      success: false,
      message: 'Błąd serwera' 
    });
  }
};