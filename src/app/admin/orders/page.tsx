'use client';

import React, { useEffect, useState } from 'react';
import {
  Receipt,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  Eye,
  X,
  CreditCard,
  QrCode,
  Bank
} from '@phosphor-icons/react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
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
    fetchOrders();
  }, []);

  const handleVerify = async (orderId: number, status: 'verified' | 'rejected') => {
    try {
      await fetch(`/api/admin/orders/${orderId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: status === 'verified' ? 'paid' : 'rejected' }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display uppercase">
            Daftar & <span className="text-[#00f0ff]">Verifikasi Pesanan</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Validasi pembayaran tiket pelanggan, cetak status lunas, dan pantau riwayat transaksi.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari kode pesanan / nama / email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'pending', 'paid', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#00f0ff] text-black shadow-md shadow-[#00f0ff]/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12 text-zinc-400 font-mono text-sm">Memuat daftar pesanan...</div>
      ) : (
        <div className="rounded-2xl glass-panel border border-white/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 font-mono bg-black/40 border-b border-white/10">
                <tr>
                  <th className="p-4">KODE PESANAN</th>
                  <th className="p-4">PEMESAN</th>
                  <th className="p-4">EVENT & TIKET</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">METODE BAYAR</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">AKSI VERIFIKASI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-zinc-500 font-mono">
                      Tidak ada data pesanan yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#00f0ff]">
                        {order.order_code}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{order.customer_name}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">{order.customer_email}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{order.customer_phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{order.event_title || 'AURORA PULSE 2026'}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {order.items && order.items[0] ? `${order.items[0].tier_name} (${order.items[0].quantity}x)` : '1x Tiket'}
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        IDR {Number(order.total_amount).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 uppercase font-mono text-[11px] text-zinc-300">
                        {order.payment?.payment_method || 'QRIS'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            order.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg glass-pill text-zinc-300 hover:text-white"
                            title="Lihat Detail Pesanan"
                          >
                            <Eye size={16} />
                          </button>

                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerify(order.id, 'verified')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-bold text-[10px] uppercase hover:bg-emerald-400 flex items-center gap-1 cursor-pointer"
                                title="Setujui Pembayaran"
                              >
                                <CheckCircle size={14} weight="bold" />
                                <span>Verifikasi</span>
                              </button>
                              <button
                                onClick={() => handleVerify(order.id, 'rejected')}
                                className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 font-bold text-[10px] uppercase hover:bg-red-500/30 cursor-pointer"
                                title="Tolak Pembayaran"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c0e17] border border-white/15 rounded-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-mono text-[#00f0ff] block">DETAIL TRANSAKSI</span>
                <h3 className="text-lg font-bold text-white font-display">
                  {selectedOrder.order_code}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-black/40 p-3.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-zinc-500 block font-mono">Nama Pemesan</span>
                  <span className="font-bold text-white">{selectedOrder.customer_name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-mono">Email</span>
                  <span className="font-bold text-white truncate block">{selectedOrder.customer_email}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-mono">No. WhatsApp</span>
                  <span className="font-bold text-white">{selectedOrder.customer_phone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-mono">Status Pembayaran</span>
                  <span className="font-bold text-[#00f0ff] uppercase">{selectedOrder.status}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-zinc-500 block font-mono mb-1">Tiket yang Dipesan</span>
                <div className="flex justify-between items-center text-sm font-bold text-white">
                  <span>{selectedOrder.items && selectedOrder.items[0] ? selectedOrder.items[0].tier_name : 'Kategori Tiket'}</span>
                  <span className="font-mono text-[#00f0ff]">
                    IDR {Number(selectedOrder.total_amount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {selectedOrder.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleVerify(selectedOrder.id, 'rejected')}
                    className="w-1/2 py-2.5 rounded-xl bg-red-500/20 text-red-400 font-bold uppercase hover:bg-red-500/30"
                  >
                    Tolak Pesanan
                  </button>
                  <button
                    onClick={() => handleVerify(selectedOrder.id, 'verified')}
                    className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-black font-bold uppercase hover:bg-emerald-400 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={16} weight="bold" />
                    <span>Verifikasi Lunas</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
