import mongoose from 'mongoose';

const SchoolProfileSchema = new mongoose.Schema({
    name: { type: String, default: 'SLB Pelita Kasih' },
    address: String,
    phone: String,
    email: String,
    whatsapp: String,
    mapsEmbedUrl: String,
    vision: String,
    mission: [String],
    history: String,
    socials: {
        facebook: String,
        instagram: String,
        youtube: String,
        tiktok: String,
    },
    themeColor: String, // Allow admin to tweak accent color
}, { timestamps: true });

export default mongoose.models.SchoolProfile || mongoose.model('SchoolProfile', SchoolProfileSchema);
