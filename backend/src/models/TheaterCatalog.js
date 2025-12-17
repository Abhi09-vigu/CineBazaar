import mongoose from 'mongoose';

const theaterCatalogSchema = new mongoose.Schema(
  {
    name: String,
    brand: String,
    city: String,
    state: String,
    area: String,
    address: String,
    screens: Number
  },
  { timestamps: true, collection: 'theaters_catalog' }
);

export default mongoose.model('TheaterCatalog', theaterCatalogSchema);
