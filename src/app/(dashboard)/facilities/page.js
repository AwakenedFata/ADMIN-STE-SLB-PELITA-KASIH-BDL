'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiPlus, HiTrash, HiOfficeBuilding } from 'react-icons/hi';
import ImageUpload from '@/components/ui/ImageUpload';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const FACILITIES = [
    'Ruang Kelas',
    'Perpustakaan',
    'Ruang Terapi',
    'UKS',
    'Kantin',
    'Lapangan',
    'Aula',
    'Toilet',
    'Parkiran',
    'Lainnya'
];

export default function FacilitiesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Ruang Kelas'); // Default to first facility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Upload Form
    const [formData, setFormData] = useState({
        image: '',
        publicId: '',
        caption: '',
        category: 'Ruang Kelas',
    });

    const fetchFacilities = async () => {
        setLoading(true);
        try {
            // Always filter by category for Facilities page to avoid mixing
            const query = `?category=${selectedCategory}`;
            const res = await fetch(`/api/gallery${query}`, { cache: 'no-store' });
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch facilities', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacilities();
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
                setFormData({ image: '', publicId: '', caption: '', category: selectedCategory });
                fetchFacilities();
            } else {
                alert('Failed to save facility photo');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus foto fasilitas ini?')) return;
        try {
            await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fasilitas & Sarana</h1>
                    <p className="text-slate-500">Kelola foto sarana dan prasarana sekolah.</p>
                </div>
                <button
                    onClick={() => {
                        setFormData(prev => ({ ...prev, category: selectedCategory }));
                        setIsModalOpen(true);
                    }}
                    className="glass-button flex items-center gap-2"
                >
                    <HiPlus className="text-lg" />
                    <span>Upload Foto Fasilitas</span>
                </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {FACILITIES.map(cat => (
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
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-400">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 glass rounded-2xl border-dashed border-2 border-slate-300">
                        <HiOfficeBuilding className="text-5xl mx-auto mb-3 opacity-50" />
                        <p>Belum ada foto untuk kategori {selectedCategory}.</p>
                    </div>
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
                                        alt={item.caption || 'Facility Image'}
                                        width={500}
                                        height={500}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <p className="text-white text-sm font-medium mb-1">{item.caption || 'Tanpa Keterangan'}</p>
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
                title={`Upload Foto ${selectedCategory}`}
            >
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <ImageUpload
                        value={formData.image}
                        onChange={(url, publicId) => setFormData({ ...formData, image: url, publicId })}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Kategori Fasilitas</label>
                        <select
                            className="w-full glass-input"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {FACILITIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Keterangan (Caption)</label>
                        <input
                            type="text"
                            className="w-full glass-input"
                            placeholder="Contoh: Ruang Kelas 1A, Lobby Utama..."
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
