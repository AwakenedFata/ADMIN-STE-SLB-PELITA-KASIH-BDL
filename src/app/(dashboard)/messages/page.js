'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiMail, HiMailOpen, HiTrash, HiCheck, HiArchive, HiInbox } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/Modal';

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'archived'
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages', { cache: 'no-store' });
            const data = await res.json();
            setMessages(data);
            // Sync header count
            window.dispatchEvent(new Event('messageUpdated'));
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Filter messages based on tab
    const filteredMessages = messages.filter(m => {
        if (activeTab === 'inbox') return !m.archived;
        if (activeTab === 'archived') return m.archived;
        return true;
    });

    const handleRead = async (msg) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            // Optimistic update
            const updated = messages.map(m => m._id === msg._id ? { ...m, read: true } : m);
            setMessages(updated);

            // Dispatch event immediately for optimistic UI
            window.dispatchEvent(new Event('messageUpdated'));

            try {
                await fetch(`/api/messages/${msg._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ read: true }),
                });
            } catch (error) {
                console.error('Failed to mark read', error);
            }
        }
    };

    const handleArchive = async (e, id, archiveStatus = true) => {
        e.stopPropagation();
        // Optimistic update
        const updated = messages.map(m => m._id === id ? { ...m, archived: archiveStatus } : m);
        setMessages(updated);

        if (selectedMessage?._id === id) {
            // If activeTab is inbox and we archive, deselect.
            if (activeTab === 'inbox' && archiveStatus) setSelectedMessage(null);
            if (activeTab === 'archived' && !archiveStatus) setSelectedMessage(null);
        }

        window.dispatchEvent(new Event('messageUpdated'));

        try {
            await fetch(`/api/messages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ archived: archiveStatus }),
            });
        } catch (error) {
            console.error('Failed to archive', error);
            fetchMessages(); // Revert
        }
    };

    const requestDelete = (e, id) => {
        e.stopPropagation();
        setConfirmDelete({ isOpen: true, id });
    };

    const handleDelete = async () => {
        const id = confirmDelete.id;
        try {
            await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            setMessages(msgs => msgs.filter(m => m._id !== id));
            if (selectedMessage?._id === id) setSelectedMessage(null);
            window.dispatchEvent(new Event('messageUpdated'));
        } catch (error) {
            console.error('Delete failed', error);
        } finally {
            setConfirmDelete({ isOpen: false, id: null });
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                        activeTab === 'inbox' ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-white/50"
                    )}
                >
                    <HiInbox className="text-lg" />
                    Kotak Masuk
                    <span className={cn("text-xs px-1.5 py-0.5 rounded-full", activeTab === 'inbox' ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-600")}>
                        {messages.filter(m => !m.archived && !m.read).length}
                    </span>
                </button>
                <button
                    onClick={() => { setActiveTab('archived'); setSelectedMessage(null); }}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                        activeTab === 'archived' ? "bg-amber-500 text-white shadow-md" : "bg-white text-slate-600 hover:bg-white/50"
                    )}
                >
                    <HiArchive className="text-lg" />
                    Arsip
                    {messages.filter(m => m.archived && !m.read).length > 0 && (
                        <span className={cn("text-xs px-1.5 py-0.5 rounded-full", activeTab === 'archived' ? "bg-amber-600 text-white" : "bg-red-100 text-red-600")}>
                            {messages.filter(m => m.archived && !m.read).length}
                        </span>
                    )}
                </button>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Message List */}
                <div className="w-full md:w-1/3 glass-card overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-bold text-slate-700 flex items-center gap-2">
                            {activeTab === 'inbox' ? 'Kotak Masuk' : 'Pesan Diarsipkan'}
                        </h2>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {loading ? (
                            <p className="text-center text-slate-400 py-4">Loading messages...</p>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <HiMailOpen className="text-4xl mx-auto mb-2 opacity-50" />
                                <p>Tidak ada pesan.</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg._id}
                                    onClick={() => handleRead(msg)}
                                    className={cn(
                                        "p-3 rounded-xl cursor-pointer transition-all border border-transparent hover:border-blue-200 group relative",
                                        selectedMessage?._id === msg._id ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-slate-50",
                                        !msg.read && "font-semibold border-l-4 border-l-blue-500"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-slate-800 text-sm truncate pr-6">{msg.name}</h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    <p className={cn("text-xs truncate", !msg.read ? "text-slate-800" : "text-slate-500")}>
                                        {msg.subject || 'No Subject'}
                                    </p>

                                    {/* Quick Actions on Hover */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            onClick={(e) => handleArchive(e, msg._id, !msg.archived)}
                                            className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-600 rounded-full"
                                            title={msg.archived ? "Kembalikan ke Inbox" : "Arsipkan"}
                                        >
                                            <HiArchive className="text-sm" />
                                        </button>
                                        <button
                                            onClick={(e) => requestDelete(e, msg._id)}
                                            className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-full"
                                            title="Hapus"
                                        >
                                            <HiTrash className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="hidden md:flex flex-1 glass-card flex-col overflow-hidden relative">
                    {selectedMessage ? (
                        <>
                            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-xl font-bold text-slate-800">{selectedMessage.subject || 'No Subject'}</h2>
                                        {selectedMessage.archived && (
                                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium border border-amber-200">
                                                Arsip
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <span className="font-semibold">{selectedMessage.name}</span>
                                        <span className="text-slate-400">&lt;{selectedMessage.email}&gt;</span>
                                    </div>
                                    {selectedMessage.phone && (
                                        <p className="text-xs text-slate-500 mt-1">Tel: {selectedMessage.phone}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => handleArchive(e, selectedMessage._id, !selectedMessage.archived)}
                                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <HiArchive className="text-lg" />
                                        {selectedMessage.archived ? "Batal Arsip" : "Arsipkan"}
                                    </button>
                                    <button
                                        onClick={(e) => requestDelete(e, selectedMessage._id)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <HiTrash className="text-lg" />
                                        Hapus
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>

                            <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-right">
                                Diterima pada {new Date(selectedMessage.createdAt).toLocaleString('id-ID')}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <HiMailOpen className="text-6xl mb-4 opacity-50" />
                            <p>Pilih pesan untuk membaca</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <Modal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                title="Hapus Pesan"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">Apakah Anda yakin ingin menghapus pesan ini secara permanen?</p>
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
