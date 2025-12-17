import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    seatPrice: { type: Number, required: true, min: 0 },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    bookedSeats: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

showSchema.index({ movie: 1, theater: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model('Show', showSchema);
