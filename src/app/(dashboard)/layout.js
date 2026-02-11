'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 w-full max-w-[100vw]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Header onMenuClick={() => setIsSidebarOpen(true)} />
                        <main className="px-4 pb-4 md:px-6">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
