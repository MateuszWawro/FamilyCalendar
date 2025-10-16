import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importy tras
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';

// Konfiguracja env
dotenv.config();

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