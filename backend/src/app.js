import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import router from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;
