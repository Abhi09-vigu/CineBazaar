import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hash });
  const token = signToken(user);
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, reset instructions were sent.' });
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();
  // In production, send email with reset link containing rawToken
  // For development, return token to aid manual testing
  return res.status(200).json({ message: 'Reset initiated', token: process.env.NODE_ENV === 'development' ? rawToken : undefined });
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { token, password } = req.body;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: new Date() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return res.json({ message: 'Password reset successful' });
};
