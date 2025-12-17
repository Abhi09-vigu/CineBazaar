import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import SeatLock from '../models/SeatLock.js';

const seatId = (row, col) => `${String.fromCharCode(65 + row)}${col + 1}`;

const hasOverlap = (a, b) => {
  const set = new Set(a);
  return b.some((x) => set.has(x));
};

export const lockSeats = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { showId, seats } = req.body;
  const show = await Show.findById(showId);
  if (!show) return res.status(404).json({ message: 'Show not found' });

  // Check already booked
  if (hasOverlap(seats, show.bookedSeats)) {
    return res.status(409).json({ message: 'Some seats already booked' });
  }

  // Check locks by others
  const now = new Date();
  const activeLocks = await SeatLock.find({ show: showId, expiresAt: { $gt: now } });
  const lockedSeats = activeLocks.flatMap((l) => l.seats);
  if (hasOverlap(seats, lockedSeats)) {
    return res.status(409).json({ message: 'Some seats are currently locked' });
  }

  const ttl = Number(process.env.LOCK_TTL_SECONDS || 300);
  const lock = await SeatLock.create({ user: req.user._id, show: showId, seats, expiresAt: new Date(now.getTime() + ttl * 1000) });
  res.status(201).json({ lockId: lock._id, expiresAt: lock.expiresAt });
};

export const bookSeats = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { showId, seats, amount, paymentId } = req.body;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const show = await Show.findById(showId).session(session).exec();
      if (!show) throw new Error('Show not found');

      // Re-check availability inside txn
      const now = new Date();
      const activeLocks = await SeatLock.find({ show: showId, expiresAt: { $gt: now } }).session(session);
      const lockedSeats = activeLocks.flatMap((l) => l.seats);
      if (hasOverlap(seats, show.bookedSeats) || hasOverlap(seats, lockedSeats)) {
        const err = new Error('Seats no longer available');
        err.statusCode = 409;
        throw err;
      }

      // Add seats to bookedSet atomically
      const updated = await Show.updateOne(
        { _id: showId, bookedSeats: { $nin: seats } },
        { $addToSet: { bookedSeats: { $each: seats } } }
      ).session(session);
      if (updated.modifiedCount !== 1) {
        const err = new Error('Booking conflict');
        err.statusCode = 409;
        throw err;
      }

      const booking = await Booking.create([
        { user: req.user._id, show: showId, seats, amount, status: 'CONFIRMED', paymentId }
      ], { session });

      // Remove user's locks for these seats
      await SeatLock.deleteMany({ user: req.user._id, show: showId, seats: { $in: seats } }).session(session);

      res.status(201).json(booking[0]);
    });
  } catch (e) {
    const status = e.statusCode || 500;
    return res.status(status).json({ message: e.message || 'Booking failed' });
  } finally {
    await session.endSession();
  }
};

export const myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate({ path: 'show', populate: ['movie', 'theater'] }).sort({ createdAt: -1 });
  res.json(bookings);
};

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate('show');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  const showDateTime = new Date(`${booking.show.date.toISOString().split('T')[0]}T${booking.show.time}:00`);
  const cutoffMs = 2 * 60 * 60 * 1000; // 2 hours before show
  if (Date.now() > showDateTime.getTime() - cutoffMs) {
    return res.status(400).json({ message: 'Cannot cancel close to showtime' });
  }
  booking.status = 'CANCELLED';
  booking.cancelledAt = new Date();
  await booking.save();
  // Business: we do NOT free booked seats on cancel; depends on policy
  res.json({ message: 'Cancelled' });
};
