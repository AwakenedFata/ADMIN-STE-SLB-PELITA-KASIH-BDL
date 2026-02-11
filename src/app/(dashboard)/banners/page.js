'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiPlus, HiPencil, HiTrash, HiPhotograph, HiCheck } from 'react-icons/hi';
import ImageUpload from '@/components/ui/ImageUpload';
import Modal from '@/components/ui/Modal';
import Switch from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function BannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [selectedBanners, setSelectedBanners] = useState(new Set());
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null });

    // Form State
    const [formData, setFormData] = useState({
        image: '',
        publicId: '',
        active: true,
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch Banners
    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/banners', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setBanners(data);
            setSelectedBanners(new Set()); // Reset selection
        } catch (error) {
            console.error('Failed to fetch banners', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // Selection Handlers
    const toggleSelection = (id) => {
        const newSelection = new Set(selectedBanners);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedBanners(newSelection);
    };

    const toggleSelectAll = () => {
        if (selectedBanners.size === banners.length) {
            setSelectedBanners(new Set());
        } else {
            setSelectedBanners(new Set(banners.map(b => b._id)));
        }
    };

    // Modal Handlers
    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                image: banner.image || '',
                publicId: banner.publicId || '',
                active: banner.active,
                order: banner.order || 0,
            });
        } else {
            setEditingBanner(null);
            setFormData({
                image: '',
                publicId: '',
                active: true,
                order: 0,
            });
        }
        setIsModalOpen(true);
    };

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const method = editingBanner ? 'PUT' : 'POST';
            const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchBanners();
            } else {
                alert('Failed to save banner');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving banner');
        } finally {
            setSubmitting(false);
        }
    };

    const requestDelete = (id) => {
        setConfirmModal({ isOpen: true, type: 'single', id });
    };

    const requestBulkDelete = () => {
        if (selectedBanners.size === 0) return;
        setConfirmModal({ isOpen: true, type: 'bulk', id: null });
    };

    const confirmDelete = async () => {
        try {
            if (confirmModal.type === 'single') {
                const res = await fetch(`/api/banners/${confirmModal.id}`, { method: 'DELETE' });
                if (res.ok) fetchBanners();
            } else if (confirmModal.type === 'bulk') {
                const res = await fetch('/api/banners/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: Array.from(selectedBanners) }),
                });
                if (res.ok) fetchBanners();
            }
        } catch (error) {
            console.error('Delete failed', error);
            alert('Gagal menghapus');
        } finally {
            setConfirmModal({ isOpen: false, type: null, id: null });
        }
    };

    const handleToggleActive = async (banner) => {
        const newStatus = !banner.active;
        setBanners(banners.map(b => b._id === banner._id ? { ...b, active: newStatus } : b));

        try {
            await fetch(`/api/banners/${banner._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: newStatus }),
            });
        } catch (error) {
            console.error('Failed to toggle', error);
            fetchBanners();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Banner Hero Manager</h1>
                    <p className="text-slate-500">Manage the sliding banners on the homepage.</p>
                </div>
                <div className="flex gap-2">
                    {selectedBanners.size > 0 && (
                        <button
                            onClick={requestBulkDelete}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-all active:scale-95 text-sm font-medium h-[42px] px-6 flex items-center gap-2"
                        >
                            <HiTrash className="text-lg" />
                            <span>Hapus ({selectedBanners.size})</span>
                        </button>
                    )}
                    <button
                        onClick={() => handleOpenModal()}
                        className="glass-button flex items-center gap-2"
                    >
                        <HiPlus className="text-lg" />
                        <span>Add New Banner</span>
                    </button>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {!loading && banners.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="checkbox"
                        checked={selectedBanners.size === banners.length && banners.length > 0}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600">Pilih Semua</span>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-2xl bg-slate-200 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {banners.map((banner) => (
                            <motion.div
                                key={banner._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                                className={cn(
                                    "glass-card overflow-hidden group relative transition-all",
                                    selectedBanners.has(banner._id) ? "ring-2 ring-blue-500 bg-blue-50/50" : ""
                                )}
                            >
                                {/* Checkbox Overlay */}
                                <div className="absolute top-3 left-3 z-20">
                                    <input
                                        type="checkbox"
                                        checked={selectedBanners.has(banner._id)}
                                        onChange={() => toggleSelection(banner._id)}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm"
                                    />
                                </div>

                                <div className="relative h-48 w-full bg-slate-100">
                                    {banner.image ? (
                                        <Image
                                            src={banner.image}
                                            alt="Banner"
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                                            <HiPhotograph className="text-4xl" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 z-20">
                                        <Switch
                                            checked={banner.active}
                                            onChange={() => handleToggleActive(banner)}
                                        />
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                                            Urutan ke: {banner.order}
                                        </span>
                                        <span className={cn("text-xs px-2 py-1 rounded", banner.active ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500")}>
                                            {banner.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(banner)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm"
                                        >
                                            <HiPencil /> Edit
                                        </button>
                                        <button
                                            onClick={() => requestDelete(banner._id)}
                                            className="flex-center items-center justify-center px-3 py-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <HiTrash className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {banners.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 glass rounded-2xl border-dashed border-2 border-slate-300">
                            <HiPhotograph className="text-5xl mx-auto mb-3 opacity-50" />
                            <p>No banners yet. Click "Add New Banner" to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Confirm Delete Modal */}
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                title="Konfirmasi Hapus"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        {confirmModal.type === 'bulk'
                            ? `Apakah Anda yakin ingin menghapus ${selectedBanners.size} banner yang dipilih?`
                            : 'Apakah Anda yakin ingin menghapus banner ini?'}
                        <br />
                        <span className="text-red-500 text-sm">Tindakan ini tidak dapat dibatalkan.</span>
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit/Create Modal - Keeping existing modal logic */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBanner ? 'Edit Banner' : 'Create New Banner'}
            >
                <form onSubmit={handleInitialSubmit} className="space-y-4 pt-2">
                    <ImageUpload
                        label="Banner Background Image"
                        value={formData.image}
                        onChange={(url, publicId) => setFormData({ ...formData, image: url, publicId })}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Prioritas Urutan</label>
                        <input
                            type="number"
                            className="w-full glass-input"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Switch
                            checked={formData.active}
                            onChange={(v) => setFormData({ ...formData, active: v })}
                        />
                        <span className="text-sm text-slate-600">Active (Visible on website)</span>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !formData.image}
                            className="glass-button disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Saving...' : 'Save Banner'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
