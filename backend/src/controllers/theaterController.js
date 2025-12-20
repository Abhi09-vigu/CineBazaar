import { validationResult } from 'express-validator';
import Theater from '../models/Theater.js';
import TheaterCatalog from '../models/TheaterCatalog.js';

export const createTheater = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const isOwner = req.user?.role === 'OWNER';
  if (!isOwner) return res.status(403).json({ message: 'Forbidden' });
  if (!req.user?.ownerApproved) return res.status(403).json({ message: 'Owner is not approved by admin yet' });

  const { layout } = req.body || {};
  let rows = Number(req.body.rows || 0);
  let cols = Number(req.body.cols || 0);
  let totalSeats = Number(req.body.totalSeats || 0);

  // If a detailed layout is provided, compute rows/cols/totalSeats from it
  let normalizedLayout = Array.isArray(layout) ? layout : [];
  if (normalizedLayout.length) {
    rows = normalizedLayout.length;
    cols = Math.max(1, ...normalizedLayout.map(r => Array.isArray(r?.seats) ? r.seats.length : 0));
    totalSeats = normalizedLayout.reduce((sum, r) => sum + (Array.isArray(r?.seats) ? r.seats.filter(s => (s || '').trim() !== '').length : 0), 0);
  } else {
    // Fallback to rows/cols if layout not provided
    if (!rows || !cols) return res.status(400).json({ message: 'Provide either a seat layout or rows and cols' });
    totalSeats = rows * cols;
  }

  const payload = {
    name: req.body.name,
    location: req.body.location,
    rows,
    cols,
    totalSeats,
    layout: normalizedLayout,
    createdBy: req.user._id,
    owner: req.user._id,
    approved: false
  };

  const theater = await Theater.create(payload);
  res.status(201).json(theater);
};

export const updateTheater = async (req, res) => {
  const theater = await Theater.findById(req.params.id);
  if (!theater) return res.status(404).json({ message: 'Theater not found' });
  const isAdmin = req.user?.role === 'ADMIN';
  const isOwner = req.user?.role === 'OWNER' && String(theater.owner) === String(req.user._id);
  if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Forbidden' });

  // If layout is updated, recompute rows/cols/totalSeats
  const { layout } = req.body || {};
  if (Array.isArray(layout) && layout.length) {
    theater.layout = layout;
    theater.rows = layout.length;
    theater.cols = Math.max(1, ...layout.map(r => Array.isArray(r?.seats) ? r.seats.length : 0));
    theater.totalSeats = layout.reduce((sum, r) => sum + (Array.isArray(r?.seats) ? r.seats.filter(s => (s || '').trim() !== '').length : 0), 0);
  }
  if (req.body.name) theater.name = req.body.name;
  if (req.body.location) theater.location = req.body.location;

  // Owners cannot toggle approval
  if (isAdmin && typeof req.body.approved === 'boolean') theater.approved = req.body.approved;

  await theater.save();
  res.json(theater);
};

export const deleteTheater = async (req, res) => {
  const theater = await Theater.findById(req.params.id);
  if (!theater) return res.status(404).json({ message: 'Theater not found' });
  const isAdmin = req.user?.role === 'ADMIN';
  const isOwner = req.user?.role === 'OWNER' && String(theater.owner) === String(req.user._id);
  if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Forbidden' });
  await theater.deleteOne();
  res.json({ message: 'Deleted' });
};

export const listTheaters = async (req, res) => {
  const isAdmin = req.user?.role === 'ADMIN';
  const isOwner = req.user?.role === 'OWNER';
  const where = {};
  // Non-admin users see only approved theaters; owners see theirs + approved
  if (!isAdmin) {
    if (isOwner) {
      where.$or = [{ approved: true }, { owner: req.user._id }];
    } else {
      where.approved = true;
    }
  }
  const theaters = await Theater.find(where).sort({ createdAt: -1 });
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
  const theater = await Theater.create({ name: cat.name, location, rows, cols, totalSeats, createdBy: req.user?._id, approved: true });
  res.status(201).json(theater);
};

// Admin: approve a theater created by an owner
export const approveTheater = async (req, res) => {
  const theater = await Theater.findById(req.params.id);
  if (!theater) return res.status(404).json({ message: 'Theater not found' });
  theater.approved = true;
  await theater.save();
  res.json({ message: 'Approved', theater });
};

// Admin: list pending theaters for approval
export const listPendingTheaters = async (_req, res) => {
  const theaters = await Theater.find({ approved: false }).sort({ createdAt: -1 });
  res.json(theaters);
};
