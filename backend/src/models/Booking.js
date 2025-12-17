import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
    seats: [{ type: String, required: true }],
    amount: { type: Number, required: true },
    status: { type: String, enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' },
    paymentId: { type: String },
    cancelledAt: { type: Date }
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
