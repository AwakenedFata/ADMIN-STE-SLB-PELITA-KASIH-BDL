import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    thumbnail: String, // Cloudinary URL
    thumbnailPublicId: String,
    category: { type: String, default: 'Berita' },
    author: String,
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.News || mongoose.model('News', NewsSchema);
