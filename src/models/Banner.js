import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    image: { type: String, required: true }, // Cloudinary URL
    publicId: String, // Cloudinary Public ID for deletion
    link: String,
    btnText: String,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
