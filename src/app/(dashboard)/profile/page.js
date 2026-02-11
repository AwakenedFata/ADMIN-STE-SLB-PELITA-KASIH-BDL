'use client';

import { useState, useEffect } from 'react';
import { HiSave, HiOfficeBuilding, HiGlobeAlt } from 'react-icons/hi';
import { cn } from '@/lib/utils';

const TABS = [
    { id: 'general', label: 'Info Umum', icon: HiOfficeBuilding },
    { id: 'socials', label: 'Sosial Media', icon: HiGlobeAlt },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        whatsapp: '',
        mapsEmbedUrl: '',
        vision: '',
        mission: [], // handle as string split by newline for UI
        missionText: '',
        history: '',
        socials: {
            facebook: '',
            instagram: '',
            youtube: '',
            tiktok: '',
        },
        themeColor: '#3b82f6',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            const data = await res.json();
            setFormData({
                ...data,
                missionText: data.mission ? data.mission.join('\n') : '',
                socials: data.socials || { facebook: '', instagram: '', youtube: '', tiktok: '' },
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                mission: formData.missionText.split('\n').filter(line => line.trim() !== ''),
            };

            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert('Profil berhasil diperbarui!');
            } else {
                alert('Gagal menyimpan profil');
            }
        } catch (error) {
            console.error('Save failed', error);
            alert('Error saving');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-400">Loading profile...</div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Profil Sekolah</h1>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="glass-button flex items-center gap-2"
                >
                    <HiSave className="text-xl" />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
            </div>

            <div className="flex gap-2 border-b border-slate-200">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 font-medium transition-all rounded-t-xl",
                            activeTab === tab.id
                                ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        )}
                    >
                        <tab.icon className="text-lg" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="glass-card p-8 min-h-[500px]">
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nama Sekolah</label>
                            <input
                                type="text"
                                className="w-full glass-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                className="w-full glass-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Telepon</label>
                            <input
                                type="text"
                                className="w-full glass-input"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
                            <textarea
                                className="w-full glass-input h-24"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-700">Google Maps Embed URL (src iframe)</label>
                            <input
                                type="text"
                                className="w-full glass-input font-mono text-xs"
                                placeholder="https://www.google.com/maps/embed?..."
                                value={formData.mapsEmbedUrl}
                                onChange={(e) => setFormData({ ...formData, mapsEmbedUrl: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'content' && null}

                {activeTab === 'socials' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Facebook URL</label>
                            <input
                                type="text"
                                className="w-full glass-input"
                                value={formData.socials.facebook}
                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Instagram URL</label>
                            <input
                                type="text"
                                className="w-full glass-input"
                                value={formData.socials.instagram}
                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Youtube URL</label>
                            <input
                                type="text"
                                className="w-full glass-input"
                                value={formData.socials.youtube}
                                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, youtube: e.target.value } })}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
