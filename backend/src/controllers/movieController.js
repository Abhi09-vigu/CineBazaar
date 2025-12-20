import { validationResult } from 'express-validator';
import Movie from '../models/Movie.js';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';

export const createMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    let posterUrl = req.body.posterUrl;
    if (req.file) {
      const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
      const cloudinaryConfigured = !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
      if (cloudinaryConfigured) {
        const result = await uploadBufferToCloudinary(req.file.buffer, 'cinewave/movies', req.file.mimetype);
        posterUrl = result.secure_url;
      } else {
        // If a file was sent but Cloudinary isn't configured, fall back to posterUrl if provided
        if (!posterUrl) {
          return res.status(400).json({ message: 'Poster image is required. Either provide a posterUrl or configure Cloudinary to upload a file.' });
        }
        // ignore the uploaded file and continue with posterUrl
      }
    }
    if (!posterUrl) return res.status(400).json({ message: 'Poster image is required (file or URL)' });
    // Normalize types and construct payload safely
    const payload = {
      title: req.body.title?.trim(),
      description: req.body.description,
      duration: Number(req.body.duration),
      genre: req.body.genre?.trim(),
      language: req.body.language?.trim(),
      releaseDate: req.body.releaseDate ? new Date(req.body.releaseDate) : undefined,
      posterUrl,
      createdBy: req.user._id
    };
    const movie = await Movie.create(payload);
    res.status(201).json(movie);
  } catch (err) {
    console.error('createMovie error:', err?.message || err, err?.stack || '');
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: status === 400 ? 'Invalid movie data' : 'Failed to create movie', detail: err.message });
  }
};

export const updateMovie = async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
};

export const deleteMovie = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json({ message: 'Deleted' });
};

export const getMovies = async (req, res) => {
  const { q, genre, language, sortBy = 'releaseDate', order = 'desc' } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (genre) filter.genre = genre;
  if (language) filter.language = language;
  const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
  const movies = await Movie.find(filter).sort(sort).limit(100);
  res.json(movies);
};

export const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
};
