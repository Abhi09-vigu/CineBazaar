import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', index: true },
    resetPasswordToken: { type: String, index: true },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
