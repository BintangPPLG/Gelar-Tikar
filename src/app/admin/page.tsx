'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  CurrencyCircleDollar,
  Receipt,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkle,
  Lock,
  LockOpen
} from '@phosphor-icons/react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleToggleSales = async (eventId: number, currentStatus: string) => {
    setActionLoading(true);
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await fetch(`/api/admin/events/${eventId}/toggle-sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchMetrics();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId: number) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' }),
      });
      fetchMetrics();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-zinc-400 font-mono text-sm">
        <span className="animate-pulse">Memuat data statistik dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-tight">
            Dashboard <span className="text-[#00f0ff]">Utama</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Ringkasan performa penjualan tiket, kuota kategori, dan verifikasi pesanan konser.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-xs font-mono text-zinc-300">
          <Sparkle size={16} weight="fill" className="text-[#00f0ff]" />
          <span>SISTEM TERHUBUNG: MYSQL2 POOL</span>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Tiket Terjual */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Tiket Terjual</span>
            <div className="p-2 rounded-lg bg-[#00f0ff]/15 text-[#00f0ff]">
              <Ticket size={20} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono-num">
              {metrics?.totalTicketsSold?.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-zinc-500 ml-2">/ {metrics?.totalQuota}</span>
            </div>
            <div className="text-[11px] text-[#00f0ff] mt-1 font-semibold">
              {Math.round((metrics?.totalTicketsSold / metrics?.totalQuota) * 100)}% dari Total Kuota
            </div>
          </div>
        </div>

        {/* Metric 2: Total Pendapatan */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Total Pendapatan</span>
            <div className="p-2 rounded-lg bg-[#10b981]/15 text-[#10b981]">
              <CurrencyCircleDollar size={20} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono-num">
              IDR {metrics?.totalRevenue?.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-[#10b981] mt-1 font-semibold">
              Dari {metrics?.paidOrdersCount} Transaksi Lunas
            </div>
          </div>
        </div>

        {/* Metric 3: Total Pesanan */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Status Pesanan</span>
            <div className="p-2 rounded-lg bg-[#ff9f1c]/15 text-[#ff9f1c]">
              <Receipt size={20} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono-num">
              {metrics?.totalOrders} <span className="text-xs font-normal text-zinc-500">Pesanan</span>
            </div>
            <div className="text-[11px] text-[#ff9f1c] mt-1 font-semibold flex items-center gap-1">
              <Clock size={14} />
              <span>{metrics?.pendingOrdersCount} Menunggu Verifikasi</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Event Aktif & Toggle Sales */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Status Event Utama</span>
            <div className="p-2 rounded-lg bg-[#ff2a6d]/15 text-[#ff2a6d]">
              <Calendar size={20} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white truncate mb-2">
              AURORA PULSE 2026
            </div>
            <button
              onClick={() => handleToggleSales(1, metrics?.activeEventsCount > 0 ? 'open' : 'closed')}
              disabled={actionLoading}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                metrics?.activeEventsCount > 0
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                  : 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 hover:bg-[#00f0ff]/30'
              }`}
            >
              {metrics?.activeEventsCount > 0 ? (
                <>
                  <Lock size={14} />
                  <span>Tutup Penjualan Tiket</span>
                </>
              ) : (
                <>
                  <LockOpen size={14} />
                  <span>Buka Penjualan Tiket</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Quota by Tier & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quota Progress by Category (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <h2 className="text-base font-bold text-white font-display uppercase">
              Kuota per Kategori Tiket
            </h2>
            <Link href="/admin/tickets" className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1">
              <span>Kelola</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-5">
            {metrics?.ticketTiers?.map((tier: any) => {
              const percentage = Math.round((tier.sold_count / tier.total_quota) * 100);
              return (
                <div key={tier.id} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">{tier.name}</span>
                    <span className="font-mono text-zinc-400">
                      {tier.sold_count} / {tier.total_quota} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percentage >= 90
                          ? 'bg-gradient-to-r from-[#ff2a6d] to-red-500'
                          : percentage >= 50
                          ? 'bg-gradient-to-r from-[#00f0ff] to-[#ff9f1c]'
                          : 'bg-gradient-to-r from-[#00f0ff] to-[#00b4d8]'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Harga: IDR {Number(tier.price).toLocaleString('id-ID')}</span>
                    <span className={tier.status === 'active' ? 'text-[#00f0ff]' : 'text-red-400'}>
                      Status: {tier.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders & Quick Verify (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <h2 className="text-base font-bold text-white font-display uppercase">
              Pesanan Terbaru
            </h2>
            <Link href="/admin/orders" className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1">
              <span>Lihat Semua</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-500 font-mono border-b border-white/10">
                <tr>
                  <th className="pb-3">KODE PESANAN</th>
                  <th className="pb-3">PEMESAN</th>
                  <th className="pb-3">TOTAL</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {metrics?.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono text-[#00f0ff] font-semibold">
                      {order.order_code}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{order.customer_name}</div>
                      <div className="text-[10px] text-zinc-500">{order.customer_email}</div>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-zinc-200">
                      IDR {Number(order.total_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5">
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
                    <td className="py-3.5 text-right">
                      {order.status === 'pending' ? (
                        <button
                          onClick={() => handleVerifyPayment(order.id)}
                          className="px-2.5 py-1 rounded bg-[#00f0ff] text-black font-bold text-[10px] uppercase hover:bg-[#38bdf8] transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <CheckCircle size={12} weight="bold" />
                          <span>Verifikasi</span>
                        </button>
                      ) : (
                        <span className="text-zinc-500 text-[10px] font-mono">Terverifikasi</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
