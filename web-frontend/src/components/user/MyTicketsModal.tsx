import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Ticket, QrCode, CheckCircle, Clock, CalendarBlank, MapPin, DownloadSimple, ArrowLeft } from '@phosphor-icons/react';
import QRCode from 'qrcode';
import { api, Order } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { playClickBeep } from '../../audio/synthAudio';

interface MyTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const fetchOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.orders.getMyOrders(user.email);
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
      setSelectedOrder(null);
    }
  }, [isOpen, user]);

  const handleSelectOrder = async (order: Order) => {
    playClickBeep();
    setSelectedOrder(order);
    try {
      const ticketCode = order.items?.[0]?.ticket_code || order.order_code;
      const url = await QRCode.toDataURL(ticketCode, {
        width: 320,
        margin: 2,
        color: {
          dark: '#08090c',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-2xl bg-[#111319] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Accent */}
        <div className="h-1 w-full bg-acid" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#0e1017]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-acid">
              <Ticket size={22} weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">Tiket & Pesanan Saya</h3>
              <p className="text-xs font-mono text-zinc-400">Akun: {user?.name} ({user?.email})</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickBeep();
              onClose();
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/10 btn-tactile cursor-pointer"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-zinc-400">Mengambil data tiket dari database...</p>
            </div>
          ) : selectedOrder ? (
            /* E-TICKET PASS & QR VIEW */
            <div className="space-y-5 animate-fadeIn">
              <button
                onClick={() => {
                  playClickBeep();
                  setSelectedOrder(null);
                }}
                className="inline-flex items-center gap-2 text-xs font-mono text-acid hover:underline btn-tactile cursor-pointer font-bold"
              >
                <ArrowLeft size={14} />
                <span>Kembali ke Daftar Tiket</span>
              </button>

              {/* Physical Festival Pass Card */}
              <div className="bg-[#171a24] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Left Pass Details */}
                  <div className="space-y-3.5 flex-1 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acid/10 text-acid border border-acid/20 text-xs font-mono font-bold">
                      OFFICIAL FESTIVAL PASS
                    </span>

                    <h4 className="text-2xl font-black font-display text-white">
                      {selectedOrder.event_title || 'AURORA PULSE 2026'}
                    </h4>

                    <p className="text-sm font-bold text-acid font-mono">
                      {selectedOrder.items?.[0]?.tier_name || 'VIP Pass'} × {selectedOrder.items?.[0]?.quantity || 1}
                    </p>

                    <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <CalendarBlank size={15} className="text-acid" />
                        <span>18-20 Oktober 2026 • Gate Buka 15:00 WIB</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <MapPin size={15} className="text-cobalt" />
                        <span>Stadion Madya Gelora Bung Karno, Jakarta</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-xs font-mono space-y-1">
                      <div>
                        <span className="text-zinc-500">Nama Pemilik: </span>
                        <span className="text-white font-bold">{selectedOrder.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Kode Tiket: </span>
                        <span className="text-acid font-bold">{selectedOrder.items?.[0]?.ticket_code || selectedOrder.order_code}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Graphic */}
                  <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center shrink-0">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="E-Ticket QR" className="w-40 h-40 object-contain" />
                    ) : (
                      <div className="w-40 h-40 bg-zinc-200" />
                    )}
                    <span className="text-[10px] font-mono text-black font-bold mt-1.5 tracking-wider">
                      SCAN DI GATE MASUK
                    </span>
                  </div>
                </div>

                {/* Perforation Line */}
                <div className="ticket-divider-dashed my-5" />

                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Status Pembayaran:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      selectedOrder.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {selectedOrder.status === 'paid' ? 'LUNAS / VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  {qrDataUrl && (
                    <a
                      href={qrDataUrl}
                      download={`AuroraPulse-Ticket-${selectedOrder.order_code}.png`}
                      className="inline-flex items-center gap-1.5 text-xs text-acid hover:underline font-bold btn-tactile cursor-pointer"
                    >
                      <DownloadSimple size={15} />
                      <span>Unduh QR</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            /* EMPTY STATE */
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                <Ticket size={28} />
              </div>
              <h4 className="text-base font-bold text-white mb-1 font-display">Belum Ada Tiket yang Dipesan</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-5">
                Pilih kategori tiket di halaman utama dan lakukan checkout untuk mendapatkan tiket resmi festival.
              </p>
              <button
                onClick={() => {
                  playClickBeep();
                  onClose();
                  const el = document.getElementById('tickets');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-acid text-black font-bold text-xs uppercase tracking-wider btn-tactile hover:brightness-105 cursor-pointer"
              >
                Pilih Tiket Konser Sekarang →
              </button>
            </div>
          ) : (
            /* ORDERS LIST */
            <div className="space-y-3">
              {orders.map((order) => {
                const isPaid = order.status === 'paid';
                return (
                  <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className="p-4 sm:p-5 rounded-2xl bg-black/40 hover:bg-white/[0.04] border border-white/10 hover:border-acid/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group btn-tactile"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isPaid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isPaid ? <CheckCircle size={24} weight="fill" /> : <Clock size={24} weight="fill" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-400 font-bold">{order.order_code}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {isPaid ? 'LUNAS' : 'PENDING'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-acid transition-colors mt-0.5 font-display">
                          {order.event_title || 'AURORA PULSE: WORLD TOUR 2026'}
                        </h4>
                        <p className="text-xs text-zinc-400 font-mono">
                          {order.items?.[0]?.tier_name || 'VIP Holographic Pass'} × {order.items?.[0]?.quantity || 1} Tiket
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      <span className="text-sm font-extrabold text-white font-mono-num">
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] font-mono text-acid flex items-center gap-1">
                        <QrCode size={14} />
                        <span>Buka E-Ticket Pass →</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
