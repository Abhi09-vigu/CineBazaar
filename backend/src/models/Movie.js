import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Text index for search; avoid clashing with document `language` field by changing language_override
movieSchema.index(
  { title: 'text', description: 'text', genre: 'text', language: 'text' },
  { default_language: 'english', language_override: 'textLanguage', name: 'movie_text_index' }
);

export default mongoose.model('Movie', movieSchema);
