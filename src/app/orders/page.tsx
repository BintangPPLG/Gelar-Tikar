'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import {
  Sparkle,
  Ticket,
  Receipt,
  CheckCircle,
  Clock,
  DownloadSimple,
  ShieldCheck,
  MagnifyingGlass,
  ArrowLeft,
  QrCode
} from '@phosphor-icons/react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [emailQuery, setEmailQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const fetchOrders = async (email?: string) => {
    setLoading(true);
    try {
      const url = email ? `/api/orders?email=${encodeURIComponent(email)}` : '/api/orders';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('aurora_customer_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmailQuery(user.email);
      fetchOrders(user.email);
    } else {
      fetchOrders();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(emailQuery);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-[#0b0d14]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#ff2a6d] p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#08090d] rounded-[7px] flex items-center justify-center">
              <Sparkle size={16} weight="fill" className="text-[#00f0ff]" />
            </div>
          </div>
          <span className="text-base font-extrabold tracking-tight text-white font-display">
            AURORA<span className="text-[#00f0ff]">PULSE</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg glass-pill text-xs font-mono text-zinc-300 hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/15 text-[#00f0ff] hover:bg-[#00f0ff]/25 text-xs font-mono font-bold"
          >
            Portal Admin
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display uppercase tracking-tight">
            Riwayat Pesanan & <span className="text-[#00f0ff]">E-Ticket QR</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Cek status pembayaran tiket Anda dan tampilkan QR Code tiket untuk pemindaian di pintu masuk konser.
          </p>
        </div>

        {/* Search by email */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md bg-black/40 p-2 rounded-xl border border-white/10">
          <input
            type="email"
            placeholder="Masukkan email pemesan..."
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#00f0ff] text-black font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
          >
            <MagnifyingGlass size={14} weight="bold" />
            <span>Cari</span>
          </button>
        </form>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12 text-zinc-400 font-mono text-sm">Memuat riwayat tiket...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 rounded-2xl glass-panel border border-white/10 p-8 space-y-3">
            <Ticket size={40} className="text-zinc-600 mx-auto" />
            <div className="text-base font-bold text-white">Belum Ada Riwayat Pesanan</div>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Anda belum memesan tiket konser. Silakan pilih kategori tiket yang Anda inginkan di halaman utama.
            </p>
            <Link
              href="/#tickets"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs uppercase"
            >
              Pesan Tiket Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl glass-panel border border-white/15 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/25 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#00f0ff]">
                      {order.order_code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        order.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : order.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {order.status === 'paid' ? 'LUNAS (VERIFIED)' : order.status === 'pending' ? 'MENUNGGU PEMBAYARAN' : 'DIBATALKAN'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display">
                    {order.event_title || 'AURORA PULSE: WORLD TOUR 2026'}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-xs text-zinc-400 font-mono">
                    <span>Pemesan: <strong className="text-white">{order.customer_name}</strong></span>
                    <span>•</span>
                    <span>Total: <strong className="text-[#00f0ff]">IDR {Number(order.total_amount).toLocaleString('id-ID')}</strong></span>
                    <span>•</span>
                    <span>Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                {/* QR Code trigger & view */}
                <div className="flex items-center gap-3 shrink-0">
                  {order.status === 'paid' ? (
                    <button
                      onClick={() => setSelectedTicket(order)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#00f0ff]/20 cursor-pointer"
                    >
                      <QrCode size={18} weight="bold" />
                      <span>Lihat QR E-Ticket</span>
                    </button>
                  ) : (
                    <div className="text-xs text-amber-400 font-mono flex items-center gap-1.5 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                      <Clock size={16} />
                      <span>Menunggu verifikasi admin</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal QR Code E-Ticket */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-md bg-[#0c0e17] border border-[#00f0ff]/40 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 holographic-sheen opacity-10 pointer-events-none" />

              <div className="relative z-10 text-center space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono text-[#00f0ff]">E-TICKET RESMI FESTIVAL</span>
                  <button onClick={() => setSelectedTicket(null)} className="text-xs text-zinc-400 hover:text-white font-mono">
                    Tutup [X]
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white font-display uppercase">
                    {selectedTicket.event_title || 'AURORA PULSE 2026'}
                  </h3>
                  <div className="text-xs text-zinc-400 font-mono mt-1">
                    Stadion Madya GBK Jakarta • 18-20 Okt 2026
                  </div>
                </div>

                {/* SVG QR Code Box */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                  <QRCodeSVG
                    value={`https://aurorapulse.com/verify?ticket=${selectedTicket.order_code}`}
                    size={160}
                    level="H"
                  />
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-white/10 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-mono">ID TIKET:</span>
                    <span className="font-mono font-bold text-[#00f0ff]">{selectedTicket.order_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-mono">PEMEGANG:</span>
                    <span className="font-bold text-white">{selectedTicket.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-mono">STATUS:</span>
                    <span className="font-bold text-emerald-400 uppercase">TIKET AKTIF (LUNAS)</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`E-Ticket ${selectedTicket.order_code} berhasil diunduh!`)}
                  className="w-full py-3 rounded-xl bg-[#00f0ff] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <DownloadSimple size={16} weight="bold" />
                  <span>Unduh E-Ticket (PDF / Gambar)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 p-6 text-center text-xs text-zinc-500 font-mono">
        © 2026 AURORA PULSE FESTIVAL. Database terhubung MySQL2.
      </footer>
    </div>
  );
}
