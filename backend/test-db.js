import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: '192.168.1.86',
  port: 5432,
  user: 'postgres',
  password: 'mateusz',
  database: 'calendar_dev',
});

console.log('🔌 Próba połączenia z bazą...');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Błąd połączenia:', err);
  } else {
    console.log('✅ Połączono! Czas serwera:', res.rows[0].now);
  }
  pool.end();
});