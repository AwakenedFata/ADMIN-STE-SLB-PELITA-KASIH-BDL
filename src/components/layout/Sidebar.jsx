'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  HiHome, 
  HiPhotograph, 
  HiNewspaper, 
  HiCollection, 
  HiMail, 
  HiCog, 
  HiLogout,
  HiOfficeBuilding
} from 'react-icons/hi';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: HiHome },
  { name: 'Banner Hero', href: '/banners', icon: HiPhotograph },
  { name: 'Berita & Kegiatan', href: '/news', icon: HiNewspaper },
  { name: 'Galeri Kegiatan', href: '/gallery', icon: HiCollection },
  { name: 'Fasilitas & Sarana', href: '/facilities', icon: HiOfficeBuilding },
  { name: 'Pesan Masuk', href: '/messages', icon: HiMail },
  { name: 'Profil Sekolah', href: '/profile', icon: HiCog },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="glass h-full w-full rounded-2xl flex flex-col p-4 shadow-xl bg-white/80 backdrop-blur-xl border border-white/20">
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-200/50">
          <div className="relative h-12 w-12 shrink-0">
             <img src="/images/logo.png" alt="SLB Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">SLB Pelita Kasih</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={onClose} // Close sidebar on mobile nav click
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-blue-500/10 text-blue-600 font-semibold shadow-sm border border-blue-200/50" 
                    : "text-slate-500 hover:bg-white/60 hover:text-blue-500"
                )}
              >
                <item.icon className={cn("text-xl relative z-10", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500")} />
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500 z-10" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <HiLogout className="text-xl" />
          <span>Keluar</span>
        </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Static) */}
      <aside className="h-full w-64 p-4 hidden md:flex flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div className={cn(
        "fixed inset-0 z-50 md:hidden transition-all duration-300",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />
        {/* Slide-in Menu */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-72 p-4 transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
           <SidebarContent />
        </div>
      </div>
    </>
  );
}
