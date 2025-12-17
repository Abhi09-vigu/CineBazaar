import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureAdmin } from './utils/ensureAdmin.js';
import Movie from './models/Movie.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
      await ensureAdmin();
      // Sync indexes to apply updated text index options in development
      if (process.env.NODE_ENV !== 'production') {
        try {
          // Drop existing text indexes that may conflict with schema options
          try {
            await Movie.collection.dropIndexes();
            console.log('🗑️  Dropped all Movie indexes');
          } catch (e) {
            console.warn('⚠️  Could not drop Movie indexes:', e?.message || e);
          }
          await Movie.syncIndexes();
          console.log('✅ Movie indexes synced');
        } catch (e) {
          console.warn('⚠️  Failed to sync Movie indexes:', e?.message || e);
        }
      }
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err?.message || err);
    process.exit(1);
  }
};

start();
