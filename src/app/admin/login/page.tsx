'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkle, LockKey, Envelope, ArrowRight, ShieldCheck, Info } from '@phosphor-icons/react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@aurorapulse.com');
  const [password, setPassword] = useState('AdminAurora2026!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login gagal');
      }

      if (data.data.user.role !== 'admin') {
        throw new Error('Akses ditolak: Akun Anda bukan administrator');
      }

      localStorage.setItem('aurora_admin_token', data.data.token);
      localStorage.setItem('aurora_admin_user', JSON.stringify(data.data.user));
      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#ff2a6d]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f0ff] via-[#ff2a6d] to-[#ff9f1c] p-0.5 flex items-center justify-center shadow-lg shadow-[#00f0ff]/20">
              <div className="w-full h-full bg-[#08090d] rounded-[10px] flex items-center justify-center">
                <Sparkle size={20} weight="fill" className="text-[#00f0ff]" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-display">
              AURORA<span className="text-[#00f0ff]">ADMIN</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-zinc-400">
            Masuk ke portal manajemen konser & verifikasi tiket.
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-5 flex items-center gap-2">
              <ShieldCheck size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Email Administrator
              </label>
              <div className="relative">
                <Envelope size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aurorapulse.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Password (Bcrypt Encrypted)
              </label>
              <div className="relative">
                <LockKey size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00f0ff]/25 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Memverifikasi Akun...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight size={16} weight="bold" />
                </>
              )}
            </button>
          </form>

          {/* Helper Credentials Box */}
          <div className="mt-6 pt-5 border-t border-white/10 bg-black/40 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 rounded-b-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#00f0ff] font-mono font-bold">
              <Info size={16} weight="fill" />
              <span>Kredensial Default Admin:</span>
            </div>
            <div className="text-zinc-300 font-mono text-[11px] space-y-0.5 pl-5">
              <div>Email: <span className="text-white font-semibold">admin@aurorapulse.com</span></div>
              <div>Password: <span className="text-white font-semibold">AdminAurora2026!</span></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">
            ← Kembali ke Website Pelanggan
          </Link>
        </div>
      </div>
    </div>
  );
}
