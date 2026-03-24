import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  featured: boolean;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title:      { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, lowercase: true },
    summary:    { type: String, required: true, maxlength: 300 },
    content:    { type: String, required: true },
    coverImage: { type: String, default: '' },
    category:   {
      type: String,
      enum: ['Primera División', 'Copa del Rey', 'Fichajes', 'Cantera', 'Opinión', 'Historia'],
      default: 'Primera División',
    },
    featured: { type: Boolean, default: false },
    author:   { type: String, default: 'Redacción' },
  },
  { timestamps: true }
);

// Evita redefinir el modelo en hot-reload de Next.js
const News: Model<INews> =
  (mongoose.models.News as Model<INews>) || mongoose.model<INews>('News', NewsSchema);

export default News;
