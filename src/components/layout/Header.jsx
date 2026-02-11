'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiBell, HiMenuAlt2 } from 'react-icons/hi';

export default function Header({ onMenuClick }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/messages', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setUnreadCount(data.filter(m => !m.read && !m.archived).length);
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };
    fetchUnread();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    
    // Listen for updates
    const handleUpdate = () => fetchUnread();
    window.addEventListener('messageUpdated', handleUpdate);

    return () => {
        clearInterval(interval);
        window.removeEventListener('messageUpdated', handleUpdate);
    };
  }, []);

  const getPageHeight = () => {
    switch(pathname) {
      case '/': return 'Dashboard Overview';
      case '/banners': return 'Banner Manager';
      case '/news': return 'Berita & Kegiatan';
      case '/gallery': return 'Galeri Kegiatan';
      case '/facilities': return 'Fasilitas & Sarana';
      case '/messages': return 'Pesan Masuk';
      case '/profile': return 'Profil Sekolah';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 p-4">
      <div className="glass px-4 md:px-6 py-3 rounded-2xl flex items-center justify-between shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            <HiMenuAlt2 className="text-2xl" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-slate-800 line-clamp-1">{getPageHeight()}</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Link href="/messages" className="p-2 text-slate-500 hover:bg-white/50 rounded-full transition-colors relative block">
            <HiBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
            )}
          </Link>
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500">{session?.user?.email || 'Administrator'}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              {session?.user?.image ? (
                <img src={session.user.image} alt="User" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-blue-500 grid place-items-center text-white font-bold text-lg">
                  A
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
