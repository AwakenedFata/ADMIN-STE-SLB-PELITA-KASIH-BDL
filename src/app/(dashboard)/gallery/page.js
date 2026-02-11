'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiPlus, HiTrash } from 'react-icons/hi';
import ImageUpload from '@/components/ui/ImageUpload';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Categories for Activities & Events
const CATEGORIES = ['All', 'Kegiatan', 'Prestasi', 'Karya Siswa', 'Upacara', 'Lainnya'];

export default function GalleryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Upload Form
    const [formData, setFormData] = useState({
        image: '',
        publicId: '',
        caption: '',
        category: 'Kegiatan',
    });

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const query = selectedCategory !== 'All' ? `?category=${selectedCategory}` : '';
            const res = await fetch(`/api/gallery${query}`, { cache: 'no-store' });
            const data = await res.json();

            // Filter out facilities if 'All' is selected, to keep this page strictly for Events/Gallery
            // Facility categories to exclude:
            const facilityCats = ['Ruang Kelas', 'Perpustakaan', 'Ruang Terapi', 'UKS', 'Masjid', 'Kantin', 'Lapangan', 'Aula', 'Toilet'];

            const filteredData = selectedCategory === 'All'
                ? data.filter(item => !facilityCats.includes(item.category) && item.category !== 'Fasilitas')
                : data;

            setItems(filteredData);
        } catch (error) {
            console.error('Failed to fetch gallery', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [selectedCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ image: '', publicId: '', caption: '', category: 'Kegiatan' }); // Reset
                fetchGallery();
            } else {
                alert('Failed to save image');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus foto ini?')) return;
        try {
            await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            // Optimistic update
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Galeri Kegiatan</h1>
                    <p className="text-slate-500">Dokumentasi kegiatan, prestasi, dan karya siswa sekolah.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="glass-button flex items-center gap-2"
                >
                    <HiPlus className="text-lg" />
                    <span>Upload Foto</span>
                </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            selectedCategory === cat
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {loading && items.length === 0 ? (
                    <p className="text-slate-500 col-span-full">Loading gallery...</p>
                ) : (
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                                className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className="relative w-full">
                                    <Image
                                        src={item.image}
                                        alt={item.caption || 'Gallery Image'}
                                        width={500}
                                        height={500}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <p className="text-white text-sm font-medium mb-1">{item.caption}</p>
                                        <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded w-fit mb-2">{item.category}</span>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                        >
                                            <HiTrash />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Upload Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Upload Foto Baru"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ImageUpload
                        value={formData.image}
                        onChange={(url, publicId) => setFormData({ ...formData, image: url, publicId })}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Kategori</label>
                        <select
                            className="w-full glass-input"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Keterangan (Caption)</label>
                        <input
                            type="text"
                            className="w-full glass-input"
                            placeholder="Deskripsi foto..."
                            value={formData.caption}
                            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={uploading || !formData.image}
                            className="glass-button disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Simpan Foto'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
