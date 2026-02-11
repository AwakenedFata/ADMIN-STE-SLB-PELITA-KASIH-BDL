import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    caption: String,
    image: { type: String, required: true },
    publicId: String,
    category: { type: String, default: 'Kegiatan' }, // Fasilitas, Kegiatan, Prestasi
    featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
