import mongoose from 'mongoose';

const seatLockSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
    seats: [{ type: String, required: true }],
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// TTL index: expiresAt dictates document removal
seatLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('SeatLock', seatLockSchema);
