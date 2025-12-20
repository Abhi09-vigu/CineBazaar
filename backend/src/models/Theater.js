import mongoose from 'mongoose';

// Row schema for flexible seating layout: seats strings, empty string denotes space
const seatRowSchema = new mongoose.Schema(
  {
    seats: [{ type: String, default: '' }]
  },
  { _id: false }
);

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rows: { type: Number, required: true, min: 1 },
    cols: { type: Number, required: true, min: 1 },
    totalSeats: { type: Number, required: true, min: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approved: { type: Boolean, default: false, index: true },
    layout: { type: [seatRowSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model('Theater', theaterSchema);
