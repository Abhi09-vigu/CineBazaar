import { validationResult } from 'express-validator';
import Show from '../models/Show.js';
import Theater from '../models/Theater.js';

export const createShow = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const theater = await Theater.findById(req.body.theater);
  if (!theater) return res.status(404).json({ message: 'Theater not found' });
  const payload = {
    ...req.body,
    rows: theater.rows,
    cols: theater.cols,
    totalSeats: theater.totalSeats,
    createdBy: req.user._id
  };
  const show = await Show.create(payload);
  res.status(201).json(show);
};

export const updateShow = async (req, res) => {
  const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!show) return res.status(404).json({ message: 'Show not found' });
  res.json(show);
};

export const deleteShow = async (req, res) => {
  const show = await Show.findByIdAndDelete(req.params.id);
  if (!show) return res.status(404).json({ message: 'Show not found' });
  res.json({ message: 'Deleted' });
};

export const listShows = async (req, res) => {
  const { movie, theater, date } = req.query;
  const filter = {};
  if (movie) filter.movie = movie;
  if (theater) filter.theater = theater;
  if (date) filter.date = new Date(date);
  const shows = await Show.find(filter).populate('movie theater');
  res.json(shows);
};

export const getShow = async (req, res) => {
  const show = await Show.findById(req.params.id).populate('movie theater');
  if (!show) return res.status(404).json({ message: 'Show not found' });
  res.json(show);
};
