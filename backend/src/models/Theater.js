import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rows: { type: Number, required: true, min: 1 },
    cols: { type: Number, required: true, min: 1 },
    totalSeats: { type: Number, required: true, min: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Theater', theaterSchema);
