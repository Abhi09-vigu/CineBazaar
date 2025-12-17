import { validationResult } from 'express-validator';
import Theater from '../models/Theater.js';
import TheaterCatalog from '../models/TheaterCatalog.js';

export const createTheater = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const totalSeats = req.body.rows * req.body.cols;
  const theater = await Theater.create({ ...req.body, totalSeats, createdBy: req.user._id });
  res.status(201).json(theater);
};

export const updateTheater = async (req, res) => {
  const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!theater) return res.status(404).json({ message: 'Theater not found' });
  res.json(theater);
};

export const deleteTheater = async (req, res) => {
  const theater = await Theater.findByIdAndDelete(req.params.id);
  if (!theater) return res.status(404).json({ message: 'Theater not found' });
  res.json({ message: 'Deleted' });
};

export const listTheaters = async (_req, res) => {
  const theaters = await Theater.find().sort({ createdAt: -1 });
  res.json(theaters);
};

// Admin: import a theater from catalog (by name + city) into main Theater collection
export const importTheaterFromCatalog = async (req, res) => {
  const { name, city, rows = 10, cols = 12 } = req.body || {};
  if (!name || !city) return res.status(400).json({ message: 'name and city are required' });
  const cat = await TheaterCatalog.findOne({ name, city });
  if (!cat) return res.status(404).json({ message: 'Catalog theater not found' });
  const existing = await Theater.findOne({ name, location: { $in: [cat.area || '', `${cat.area || ''}, ${cat.city}`.trim(), cat.city] } });
  if (existing) return res.status(200).json(existing);
  const totalSeats = rows * cols;
  const location = cat.area ? cat.area : cat.city;
  const theater = await Theater.create({ name: cat.name, location, rows, cols, totalSeats, createdBy: req.user?._id });
  res.status(201).json(theater);
};
