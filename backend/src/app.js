import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import router from './routes/index.js';

dotenv.config();

const app = express();

const parseOrigins = (value) =>
  String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Prefer CLIENT_ORIGINS="https://cine-bazaar.vercel.app,http://localhost:5173"
// Keep CLIENT_ORIGIN for backwards compatibility.
const configuredOrigins = parseOrigins(process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN);

const isOriginAllowed = (origin, allowlist) => {
  if (!origin) return true;
  if (!Array.isArray(allowlist) || allowlist.length === 0) return true;

  // Exact match first.
  if (allowlist.includes(origin)) return true;

  // Wildcards: "*" allows all; "*.domain.com" allows any subdomain.
  if (allowlist.includes('*')) return true;

  let hostname;
  try {
    hostname = new URL(origin).hostname;
  } catch {
    return false;
  }

  return allowlist.some((entry) => {
    if (!entry) return false;
    if (entry.startsWith('*.')) {
      const suffix = entry.slice(1); // keep leading dot
      return hostname.endsWith(suffix);
    }
    return false;
  });
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (curl, server-to-server).
    if (!origin) return callback(null, true);

    // If no allowlist is configured, allow all origins (safe when not using cookies).
    if (configuredOrigins.length === 0) return callback(null, true);

    return callback(null, isOriginAllowed(origin, configuredOrigins));
  },
  // Frontend uses Authorization: Bearer <token>, not cookies.
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/', (_req, res) => {
  res.json({
    name: 'CineBazaar API',
    status: 'ok',
    health: '/health',
    api: '/api'
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;
