import mongoose, { Schema, Document, Model } from 'mongoose';

// Creamos la estructura para los comentarios
export interface IComment {
    _id?: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: Date;
}

export interface INews extends Document {
    title: string;
    slug: string;
    summary: string;
    content: string;
    coverImage: string;
    category: string;
    featured: boolean;
    author: string;
    comments: IComment[]; // <-- Añadimos el array de comentarios
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
});

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
        comments: [CommentSchema], // <-- Lo incrustamos en la noticia
    },
    { timestamps: true }
);

const News: Model<INews> =
    (mongoose.models.News as Model<INews>) || mongoose.model<INews>('News', NewsSchema);

export default News;