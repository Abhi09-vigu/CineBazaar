import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { theaters } from '../data/theaters.seed.js';

const collectionName = 'theaters_catalog';

(async () => {
  try {
    await connectDB();
    const col = mongoose.connection.collection(collectionName);
    const count = await col.countDocuments();
    if (count > 0) {
      console.log(`Collection '${collectionName}' already has ${count} documents. Skipping insert.`);
      process.exit(0);
    }
    const res = await col.insertMany(theaters, { ordered: false });
    console.log(`Inserted ${res.insertedCount} theaters into '${collectionName}'.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err?.message || err);
    process.exit(1);
  }
})();
