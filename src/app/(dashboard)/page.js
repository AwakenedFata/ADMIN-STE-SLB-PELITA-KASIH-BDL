'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    HiPhotograph,
    HiNewspaper,
    HiCollection,
    HiMail,
    HiTrendingUp,
    HiUsers
} from 'react-icons/hi';

const statsConfig = [
    { id: 'news', name: 'Total Berita', icon: HiNewspaper, color: 'text-blue-500', bg: 'bg-blue-100/50' },
    { id: 'gallery', name: 'Galeri Foto', icon: HiCollection, color: 'text-purple-500', bg: 'bg-purple-100/50' },
    { id: 'messages', name: 'Pesan Baru', icon: HiMail, color: 'text-orange-500', bg: 'bg-orange-100/50' },
    { id: 'banners', name: 'Banner Aktif', icon: HiPhotograph, color: 'text-emerald-500', bg: 'bg-emerald-100/50' },
];

const quickLinks = [
    { name: 'Buat Berita Baru', href: '/news/create', icon: HiNewspaper },
    { name: 'Upload Galeri', href: '/gallery', icon: HiCollection },
    { name: 'Cek Pesan', href: '/messages', icon: HiMail },
];

export default function DashboardPage() {
    const [stats, setStats] = useState({
        news: 0,
        gallery: 0,
        messages: 0,
        banners: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [newsRes, galleryRes, messagesRes, bannersRes] = await Promise.all([
                    fetch('/api/news'),
                    fetch('/api/gallery'),
                    fetch('/api/messages'),
                    fetch('/api/banners')
                ]);

                const news = await newsRes.json();
                const gallery = await galleryRes.json();
                const messages = await messagesRes.json();
                const banners = await bannersRes.json();

                setStats({
                    news: Array.isArray(news) ? news.length : 0,
                    gallery: Array.isArray(gallery) ? gallery.length : 0,
                    messages: Array.isArray(messages) ? messages.filter(m => !m.read).length : 0,
                    banners: Array.isArray(banners) ? banners.filter(b => b.active).length : 0
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white relative overflow-hidden"
            >
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Selamat Datang, Admin!</h2>
                    <p className="text-blue-100 max-w-xl">
                        Sistem Informasi Manajemen Web SLB Pelita Kasih. Kelola konten website publik secara mudah dan real-time.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 blur-3xl transform translate-x-12 -translate-y-12 rounded-full"></div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 flex items-center gap-4 group hover:scale-[1.02] cursor-default"
                    >
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stats[stat.id] || 0}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & Recent Activity (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <HiTrendingUp className="text-blue-500" />
                        Akses Cepat
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group text-center"
                            >
                                <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-600 group-hover:text-blue-600 mb-2 transition-colors">
                                    <link.icon className="text-xl" />
                                </div>
                                <span className="font-semibold text-slate-700 group-hover:text-blue-700 text-sm">{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* System Status (Simple) */}
                <div className="glass-card p-6 bg-slate-800 text-white">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <HiUsers className="text-emerald-400" />
                        Status Sistem
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-slate-300">Database</span>
                            <span className="text-emerald-400 font-semibold text-sm bg-emerald-400/20 px-2 py-1 rounded">Connected</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-slate-300">Storage</span>
                            <span className="text-emerald-400 font-semibold text-sm bg-emerald-400/20 px-2 py-1 rounded">Cloudinary Ready</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300">Mode</span>
                            <span className="text-blue-400 font-semibold text-sm bg-blue-400/20 px-2 py-1 rounded">Development</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
