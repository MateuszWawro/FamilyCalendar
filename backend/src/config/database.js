import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Załaduj .env z parent directory
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const { Pool } = pkg;

// Walidacja wymaganych zmiennych
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Brakujące zmienne środowiskowe:', missingVars.join(', '));
  console.error('📁 Szukano .env w:', envPath);
  process.exit(1);
}

// Debug - sprawdź czy zmienne są załadowane
console.log('🔍 Database config check:');
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : '❌ MISSING');
console.log('  DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
console.log('  DB_PASSWORD length:', process.env.DB_PASSWORD?.length || 0);
console.log('  DB_NAME:', process.env.DB_NAME);

// Upewnij się że DB_PASSWORD jest stringiem
const dbPassword = String(process.env.DB_PASSWORD || '');

if (!dbPassword) {
  console.error('❌ DB_PASSWORD jest puste!');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: dbPassword,
  database: process.env.DB_NAME || 'family_calendar',
});

// Test połączenia
pool.on('connect', () => {
  console.log('✅ Połączono z bazą danych PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Błąd bazy danych:', err);
  process.exit(-1);
});

export default pool;