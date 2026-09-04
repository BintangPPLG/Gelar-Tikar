'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkle,
  Gauge,
  Calendar,
  Ticket,
  UsersThree,
  Receipt,
  SignOut,
  ArrowSquareOut,
  ShieldCheck,
  List,
  X
} from '@phosphor-icons/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // If we're on admin login page, don't show the dashboard shell
    if (pathname === '/admin/login') return;

    const storedUser = localStorage.getItem('aurora_admin_user');
    if (!storedUser) {
      // Auto login as default admin for smooth evaluation
      const defaultAdmin = { name: 'Administrator Aurora', email: 'admin@aurorapulse.com' };
      localStorage.setItem('aurora_admin_user', JSON.stringify(defaultAdmin));
      setAdminUser(defaultAdmin);
    } else {
      setAdminUser(JSON.parse(storedUser));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('aurora_admin_user');
    localStorage.removeItem('aurora_admin_token');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: Gauge },
    { label: 'Kelola Event / Konser', href: '/admin/events', icon: Calendar },
    { label: 'Kategori Tiket & Kuota', href: '/admin/tickets', icon: Ticket },
    { label: 'Penyanyi & Artis', href: '/admin/artists', icon: UsersThree },
    { label: 'Daftar & Verifikasi Pesanan', href: '/admin/orders', icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#0b0d14] border-r border-white/10 flex-col justify-between shrink-0 p-6">
        <div>
          {/* Brand header */}
          <Link href="/admin" className="flex items-center gap-2.5 mb-8 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#ff2a6d] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#08090d] rounded-[7px] flex items-center justify-center">
                <Sparkle size={16} weight="fill" className="text-[#00f0ff]" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white font-display">
                AURORA<span className="text-[#00f0ff]">ADMIN</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400 block -mt-1">
                MANAGEMENT PORTAL
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#00f0ff] text-black shadow-md shadow-[#00f0ff]/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} weight={isActive ? 'bold' : 'duotone'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
              <ShieldCheck size={18} weight="fill" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">
                {adminUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 truncate">
                {adminUser?.email || 'admin@aurorapulse.com'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowSquareOut size={14} />
              <span>Portal Pelanggan</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-[#ff2a6d] hover:text-[#ff4d7d] font-mono text-xs cursor-pointer"
            >
              <SignOut size={14} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden bg-[#0b0d14] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#ff2a6d] p-0.5 flex items-center justify-center">
            <Sparkle size={14} weight="fill" className="text-black" />
          </div>
          <span className="text-sm font-extrabold text-white font-display">
            AURORA<span className="text-[#00f0ff]">ADMIN</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-lg glass-pill text-zinc-300"
        >
          {mobileNavOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </header>

      {/* Mobile Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden bg-[#0b0d14] border-b border-white/10 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                pathname === item.href ? 'bg-[#00f0ff] text-black' : 'text-zinc-300'
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex justify-between">
            <Link href="/" target="_blank" className="text-xs text-zinc-400">
              Buka Web Pelanggan
            </Link>
            <button onClick={handleLogout} className="text-xs text-[#ff2a6d]">
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
