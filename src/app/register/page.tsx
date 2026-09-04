'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkle, LockKey, Envelope, ArrowRight, ShieldCheck, User, Phone } from '@phosphor-icons/react';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      localStorage.setItem('aurora_customer_token', data.data.token);
      localStorage.setItem('aurora_customer_user', JSON.stringify(data.data.user));
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f0ff] via-[#ff2a6d] to-[#ff9f1c] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#08090d] rounded-[10px] flex items-center justify-center">
                <Sparkle size={20} weight="fill" className="text-[#00f0ff]" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-display">
              AURORA<span className="text-[#00f0ff]">PULSE</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-zinc-400">
            Daftar akun baru untuk mulai memesan tiket konser resmi.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-5 flex items-center gap-2">
              <ShieldCheck size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Raditya Pratama"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <Envelope size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <LockKey size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00f0ff]/25 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Mendaftarkan Akun...</span>
              ) : (
                <>
                  <span>Buat Akun Sekarang</span>
                  <ArrowRight size={16} weight="bold" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-white/10 text-xs text-zinc-400">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#00f0ff] font-bold hover:underline">
              Masuk Di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
