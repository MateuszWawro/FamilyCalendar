import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Dla ES modules musimy ręcznie znaleźć __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Załaduj .env z dokładną ścieżką
const envPath = path.resolve(__dirname, '../.env');
console.log('📁 Ładowanie .env z:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Błąd ładowania .env:', result.error);
  process.exit(1);
}

console.log('✅ .env załadowany pomyślnie');
console.log('🔍 Sprawdzanie zmiennych środowiskowych:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? `***${process.env.DB_PASSWORD.length} chars***` : '❌ UNDEFINED');
console.log('  DB_NAME:', process.env.DB_NAME);
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? `***${process.env.JWT_SECRET.length} chars***` : '❌ UNDEFINED');
console.log('');

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Importy tras
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting - max 100 requestów na 15 minut z jednego IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { 
    success: false, 
    message: 'Zbyt wiele żądań, spróbuj ponownie później' 
  }
});
app.use(limiter);

// CORS
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Zezwól na brak origin (np. Postman, mobilne aplikacje)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Niedozwolone pochodzenie CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API działa poprawnie',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint nie znaleziony' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Błąd:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Wewnętrzny błąd serwera'
  });
});

// Start serwera
app.listen(PORT, () => {
  console.log(`\n🚀 Serwer uruchomiony na porcie ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
});