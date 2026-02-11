'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

export default function NewsListPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

    const fetchNews = async () => {
        try {
            const res = await fetch('/api/news', { cache: 'no-store' });
            const data = await res.json();
            setNews(data);
        } catch (error) {
            console.error('Failed to fetch news', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const requestDelete = (id) => {
        setConfirmDelete({ isOpen: true, id });
    };

    const handleDelete = async () => {
        const id = confirmDelete.id;
        try {
            await fetch(`/api/news/${id}`, { method: 'DELETE' });
            fetchNews();
        } catch (error) {
            console.error('Delete failed', error);
        } finally {
            setConfirmDelete({ isOpen: false, id: null });
        }
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Berita & Kegiatan</h1>
                    <p className="text-slate-500">Kelola artikel, berita, dan pengumuman sekolah.</p>
                </div>
                <Link href="/news/create" className="glass-button flex items-center gap-2">
                    <HiPlus className="text-lg" />
                    <span>Buat Berita Baru</span>
                </Link>
            </div>

            <div className="glass-card p-4 flex items-center gap-4">
                <HiSearch className="text-slate-400 text-xl" />
                <input
                    type="text"
                    placeholder="Cari berita..."
                    className="bg-transparent outline-none w-full text-slate-700 placeholder:text-slate-400"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">Thumbnail</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Judul</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Kategori</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Tanggal</th>
                            <th className="p-4 text-right text-sm font-semibold text-slate-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading...</td></tr>
                        ) : filteredNews.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">Tidak ada berita ditemukan.</td></tr>
                        ) : (
                            filteredNews.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="h-12 w-20 rounded-lg bg-slate-200 relative overflow-hidden">
                                            {item.thumbnail && (
                                                <Image src={item.thumbnail} alt="" fill className="object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-800 max-w-xs truncate">{item.title}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            item.published ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {item.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/news/edit/${item._id}`}
                                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <HiPencil />
                                            </Link>
                                            <button
                                                onClick={() => requestDelete(item._id)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <HiTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Confirm Delete Modal */}
            <Modal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                title="Hapus Berita"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">Apakah Anda yakin ingin menghapus berita ini secara permanen?</p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setConfirmDelete({ isOpen: false, id: null })}
                            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
