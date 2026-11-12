import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, ShieldCheck, CurrencyDollar, Ticket, ShoppingBag, 
  Check, ArrowClockwise, Plus, CalendarBlank
} from '@phosphor-icons/react';
import { api, DashboardMetrics, Order, Event, TicketTier, Artist } from '../../api/client';
import { playClickBeep, playSuccessChime } from '../../audio/synthAudio';

interface AdminControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'tickets' | 'orders' | 'artists'>('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // New Event Form State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newDate, setNewDate] = useState('2026-10-18T16:00');
  const [newDesc, setNewDesc] = useState('');

  // New Tier Form State
  const [showAddTier, setShowAddTier] = useState(false);
  const [tierName, setTierName] = useState('');
  const [tierPrice, setTierPrice] = useState('');
  const [tierQuota, setTierQuota] = useState('100');
  const [tierDesc, setTierDesc] = useState('');

  // New Artist Form State
  const [showAddArtist, setShowAddArtist] = useState(false);
  const [artName, setArtName] = useState('');
  const [artGenre, setArtGenre] = useState('');
  const [artBio, setArtBio] = useState('');

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, ordersRes, eventsRes, tiersRes, artistsRes] = await Promise.all([
        api.admin.getDashboard(),
        api.admin.getAllOrders(),
        api.events.getAll(),
        api.tickets.getAll(),
        api.artists.getAll(),
      ]);

      if (dashRes.success) setMetrics(dashRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (tiersRes.success) setTiers(tiersRes.data);
      if (artistsRes.success) setArtists(artistsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    playSuccessChime();
    setTimeout(() => setActionMessage(null), 3000);
  };

  // 1. Verify Order Action
  const handleVerifyOrder = async (orderId: number, status: 'verified' | 'rejected') => {
    try {
      const res = await api.admin.verifyOrder(orderId, status);
      if (res.success) {
        showNotification(res.message);
        loadAllData();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memverifikasi pesanan.');
    }
  };

  // 2. Toggle Event Sales
  const handleToggleSales = async (eventId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'open' ? 'closed' : 'open';
      const res = await api.events.toggleSales(eventId, newStatus);
      if (res.success) {
        showNotification(`Status penjualan event diubah menjadi: ${newStatus.toUpperCase()}`);
        loadAllData();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status event.');
    }
  };

  // 3. Create Event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.events.create({
        title: newTitle,
        venue_name: newVenue,
        venue_address: newAddress,
        event_date: new Date(newDate).toISOString(),
        description: newDesc,
        status: 'open',
      });
      if (res.success) {
        showNotification('Event baru berhasil ditambahkan!');
        setShowAddEvent(false);
        setNewTitle('');
        setNewVenue('');
        setNewAddress('');
        setNewDesc('');
        loadAllData();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan event.');
    }
  };

  // 4. Create Tier
  const handleCreateTier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const defaultEventId = events[0]?.id || 1;
      const res = await api.tickets.create({
        event_id: defaultEventId,
        name: tierName,
        price: Number(tierPrice),
        total_quota: Number(tierQuota),
        description: tierDesc,
        status: 'active',
      });
      if (res.success) {
        showNotification('Kategori tiket baru berhasil dibuat!');
        setShowAddTier(false);
        setTierName('');
        setTierPrice('');
        setTierDesc('');
        loadAllData();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal membuat tiket.');
    }
  };

  // 5. Create Artist
  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.artists.create({
        name: artName,
        genre: artGenre,
        bio: artBio,
      });
      if (res.success) {
        showNotification('Artis lineup berhasil ditambahkan!');
        setShowAddArtist(false);
        setArtName('');
        setArtGenre('');
        setArtBio('');
        loadAllData();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan artis.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-6xl bg-[#0e1017] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Accent */}
        <div className="h-1 w-full bg-cobalt" />

        {/* Top Control Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#0a0c12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cobalt/15 border border-cobalt/30 flex items-center justify-center text-cobalt">
              <ShieldCheck size={22} weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-white">CONTROL CENTER</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  DATABASE SYNCED
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">Aurora Pulse Jakarta 2026 • Real-time Event Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickBeep();
                loadAllData();
              }}
              title="Refresh Data"
              className="p-2.5 text-zinc-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/10 btn-tactile cursor-pointer"
            >
              <ArrowClockwise size={16} />
            </button>
            <button
              onClick={() => {
                playClickBeep();
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-mono font-semibold text-zinc-300 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/10 btn-tactile flex items-center gap-1.5 cursor-pointer"
            >
              <X size={15} />
              <span>Tutup Panel</span>
            </button>
          </div>
        </div>

        {/* Action Notification Banner */}
        {actionMessage && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <Check size={16} weight="bold" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#0e1017] px-6 overflow-x-auto gap-1">
          {[
            { id: 'overview', label: 'Ringkasan & Metrik' },
            { id: 'orders', label: `Pesanan & Verifikasi (${orders.length})` },
            { id: 'tickets', label: `Kelola Tiket (${tiers.length})` },
            { id: 'events', label: `Kelola Event (${events.length})` },
            { id: 'artists', label: `Lineup Artis (${artists.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                playClickBeep();
                setActiveTab(t.id as any);
              }}
              className={`px-4 py-3.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap btn-tactile cursor-pointer ${
                activeTab === t.id
                  ? 'border-acid text-acid bg-white/[0.03]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#090b10]">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-zinc-400">Sinkronisasi data database admin...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW METRICS */}
              {activeTab === 'overview' && metrics && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#111319] border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-zinc-400">Total Pendapatan</span>
                        <CurrencyDollar size={20} className="text-acid" />
                      </div>
                      <div className="text-xl font-black text-white font-mono-num">
                        Rp {Number(metrics.totalRevenue).toLocaleString('id-ID')}
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                        ✓ {metrics.paidOrdersCount} transaksi terverifikasi
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#111319] border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-zinc-400">Tiket Terjual</span>
                        <Ticket size={20} className="text-cobalt" />
                      </div>
                      <div className="text-xl font-black text-white font-mono-num">
                        {metrics.totalTicketsSold} / {metrics.totalQuota}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono mt-1 block">
                        Kapasitas terisi {Math.round((metrics.totalTicketsSold / (metrics.totalQuota || 1)) * 100)}%
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#111319] border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-zinc-400">Pesanan Pending</span>
                        <ShoppingBag size={20} className="text-amber-400" />
                      </div>
                      <div className="text-xl font-black text-white font-mono-num">
                        {metrics.pendingOrdersCount} Pesanan
                      </div>
                      <span className="text-[11px] text-amber-400 font-mono mt-1 block">
                        Menunggu verifikasi pembayaran
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#111319] border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-zinc-400">Event Aktif</span>
                        <CalendarBlank size={20} className="text-zinc-300" />
                      </div>
                      <div className="text-xl font-black text-white font-mono-num">
                        {metrics.activeEventsCount} Event
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                        Penjualan tiket live
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Table */}
                  <div className="bg-[#111319] border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-white font-display">Pesanan Terbaru Masuk</h4>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-mono text-acid hover:underline btn-tactile cursor-pointer"
                      >
                        Buka Semua Pesanan →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-white/10 text-zinc-400">
                            <th className="pb-3 font-semibold">KODE</th>
                            <th className="pb-3 font-semibold">PEMBELI</th>
                            <th className="pb-3 font-semibold">TIKET</th>
                            <th className="pb-3 font-semibold">TOTAL</th>
                            <th className="pb-3 font-semibold">STATUS</th>
                            <th className="pb-3 text-right font-semibold">AKSI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.slice(0, 5).map((ord) => (
                            <tr key={ord.id} className="hover:bg-white/[0.02]">
                              <td className="py-3 font-bold text-acid">{ord.order_code}</td>
                              <td className="py-3 text-zinc-200">
                                <div className="font-bold">{ord.customer_name}</div>
                                <div className="text-[10px] text-zinc-500">{ord.customer_email}</div>
                              </td>
                              <td className="py-3 text-zinc-300">
                                {ord.items?.[0]?.tier_name || 'Pass'} × {ord.items?.[0]?.quantity || 1}
                              </td>
                              <td className="py-3 text-white font-mono-num font-bold">
                                Rp {Number(ord.total_amount).toLocaleString('id-ID')}
                              </td>
                              <td className="py-3">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  ord.status === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {ord.status === 'paid' ? 'LUNAS' : 'PENDING'}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                {ord.status === 'pending' ? (
                                  <button
                                    onClick={() => handleVerifyOrder(ord.id, 'verified')}
                                    className="px-3 py-1 rounded-lg bg-acid text-black font-bold hover:brightness-105 btn-tactile cursor-pointer"
                                  >
                                    Setujui (Lunas)
                                  </button>
                                ) : (
                                  <span className="text-zinc-500 text-[11px]">Terverifikasi ✓</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white font-display">Semua Transaksi Pembelian Tiket</h4>
                      <p className="text-xs font-mono text-zinc-400">Total {orders.length} pesanan tersimpan di database.</p>
                    </div>
                  </div>

                  <div className="bg-[#111319] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#0a0c12] border-b border-white/10 text-zinc-400">
                          <tr>
                            <th className="p-4 font-semibold">KODE & TANGGAL</th>
                            <th className="p-4 font-semibold">PEMBELI & KONTAK</th>
                            <th className="p-4 font-semibold">EVENT & TIER</th>
                            <th className="p-4 font-semibold">METODE & TOTAL</th>
                            <th className="p-4 font-semibold">STATUS</th>
                            <th className="p-4 text-right font-semibold">KONTROL VERIFIKASI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-white/[0.02]">
                              <td className="p-4">
                                <span className="font-bold text-acid block">{ord.order_code}</span>
                                <span className="text-[10px] text-zinc-500">
                                  {new Date(ord.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-white">{ord.customer_name}</div>
                                <div className="text-[11px] text-zinc-400">{ord.customer_email}</div>
                                <div className="text-[10px] text-zinc-500">{ord.customer_phone}</div>
                              </td>
                              <td className="p-4">
                                <div className="text-zinc-200">{ord.event_title || 'AURORA PULSE 2026'}</div>
                                <div className="text-[11px] text-zinc-400 font-bold">
                                  {ord.items?.[0]?.tier_name} × {ord.items?.[0]?.quantity || 1}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-zinc-300 block w-max mb-1">
                                  {ord.payment?.payment_method || 'QRIS'}
                                </span>
                                <div className="font-extrabold text-white font-mono-num">
                                  Rp {Number(ord.total_amount).toLocaleString('id-ID')}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  ord.status === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : ord.status === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {ord.status !== 'paid' && (
                                    <button
                                      onClick={() => handleVerifyOrder(ord.id, 'verified')}
                                      title="Setujui Pembayaran"
                                      className="px-3 py-1.5 rounded-xl bg-acid text-black font-bold text-[11px] btn-tactile hover:brightness-105 cursor-pointer"
                                    >
                                      ✓ Setujui
                                    </button>
                                  )}
                                  {ord.status === 'pending' && (
                                    <button
                                      onClick={() => handleVerifyOrder(ord.id, 'rejected')}
                                      title="Tolak Pesanan"
                                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-[11px] btn-tactile cursor-pointer"
                                    >
                                      ✕ Tolak
                                    </button>
                                  )}
                                  {ord.status === 'paid' && (
                                    <span className="text-emerald-400 text-xs font-bold">Terverifikasi ✓</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TICKETS MANAGEMENT */}
              {activeTab === 'tickets' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white font-display">Manajemen Kategori & Kuota Tiket</h4>
                      <p className="text-xs font-mono text-zinc-400">Atur harga, kuota, dan status kategori tiket konser.</p>
                    </div>
                    <button
                      onClick={() => setShowAddTier(!showAddTier)}
                      className="px-3.5 py-2 rounded-xl bg-acid text-black font-bold text-xs flex items-center gap-1.5 btn-tactile hover:brightness-105 cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Tambah Kategori Tiket</span>
                    </button>
                  </div>

                  {/* Add Tier Form */}
                  {showAddTier && (
                    <form onSubmit={handleCreateTier} className="p-6 rounded-2xl bg-[#171a24] border border-acid/30 space-y-4 shadow-xl">
                      <h5 className="text-xs font-bold text-acid uppercase font-mono">Form Tambah Tier Tiket Baru</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Nama Kategori</label>
                          <input
                            type="text"
                            required
                            value={tierName}
                            onChange={(e) => setTierName(e.target.value)}
                            placeholder="Contoh: CAT 3 Standing"
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Harga Tiket (Rp)</label>
                          <input
                            type="number"
                            required
                            value={tierPrice}
                            onChange={(e) => setTierPrice(e.target.value)}
                            placeholder="Contoh: 1250000"
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Total Kuota Tiket</label>
                          <input
                            type="number"
                            required
                            value={tierQuota}
                            onChange={(e) => setTierQuota(e.target.value)}
                            placeholder="100"
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddTier(false)}
                          className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-zinc-300 btn-tactile cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-acid text-black font-bold text-xs btn-tactile cursor-pointer"
                        >
                          Simpan Tier Tiket
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Tiers Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tiers.map((tier) => (
                      <div key={tier.id} className="p-5 rounded-2xl bg-[#111319] border border-white/10 flex flex-col justify-between shadow-md">
                        <div>
                          <div className="flex items-start justify-between">
                            <h5 className="font-bold text-white text-base font-display">{tier.name}</h5>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              tier.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {tier.status}
                            </span>
                          </div>
                          <div className="text-lg font-black text-acid font-mono-num my-2">
                            Rp {Number(tier.price).toLocaleString('id-ID')}
                          </div>
                          <p className="text-xs text-zinc-400 mb-4">{tier.description || 'Fasilitas tiket festival resmi.'}</p>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                          <span>Terjual: <strong className="text-white">{tier.sold_count}</strong> / {tier.total_quota}</span>
                          <span className="text-zinc-300">Sisa {tier.total_quota - tier.sold_count} Tiket</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: EVENTS MANAGEMENT */}
              {activeTab === 'events' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white font-display">Manajemen Event & Konser</h4>
                      <p className="text-xs font-mono text-zinc-400">Daftar event festival dan kontrol buka/tutup penjualan.</p>
                    </div>
                    <button
                      onClick={() => setShowAddEvent(!showAddEvent)}
                      className="px-3.5 py-2 rounded-xl bg-acid text-black font-bold text-xs flex items-center gap-1.5 btn-tactile hover:brightness-105 cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Buat Event Baru</span>
                    </button>
                  </div>

                  {/* Add Event Form */}
                  {showAddEvent && (
                    <form onSubmit={handleCreateEvent} className="p-6 rounded-2xl bg-[#171a24] border border-acid/30 space-y-4 shadow-xl">
                      <h5 className="text-xs font-bold text-acid uppercase font-mono">Form Buat Event Baru</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Judul Event</label>
                          <input
                            type="text"
                            required
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Contoh: BALI SUNSET FESTIVAL 2026"
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Nama Lokasi / Venue</label>
                          <input
                            type="text"
                            required
                            value={newVenue}
                            onChange={(e) => setNewVenue(e.target.value)}
                            placeholder="Contoh: GWK Cultural Park"
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Tanggal & Waktu Event</label>
                          <input
                            type="datetime-local"
                            required
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Alamat Lengkap</label>
                          <input
                            type="text"
                            required
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Jl. Raya Uluwatu, Ungasan, Kuta Selatan"
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddEvent(false)}
                          className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-zinc-300 btn-tactile cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-acid text-black font-bold text-xs btn-tactile cursor-pointer"
                        >
                          Simpan Event
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Events List */}
                  <div className="space-y-3">
                    {events.map((ev) => (
                      <div key={ev.id} className="p-5 rounded-2xl bg-[#111319] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-white text-base font-display">{ev.title}</h5>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              ev.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              STATUS: {ev.status}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 font-mono flex items-center gap-3">
                            <span>📍 {ev.venue_name}</span>
                            <span>🗓️ {new Date(ev.event_date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleSales(ev.id, ev.status)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all btn-tactile cursor-pointer ${
                              ev.status === 'open'
                                ? 'bg-white/5 text-zinc-300 hover:text-white border border-white/10'
                                : 'bg-acid text-black'
                            }`}
                          >
                            {ev.status === 'open' ? 'Kunci Penjualan' : 'Buka Penjualan'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: ARTISTS MANAGEMENT */}
              {activeTab === 'artists' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white font-display">Manajemen Lineup Bintang Tamu</h4>
                      <p className="text-xs font-mono text-zinc-400">Kelola musisi dan artis pengisi festival Aurora Pulse.</p>
                    </div>
                    <button
                      onClick={() => setShowAddArtist(!showAddArtist)}
                      className="px-3.5 py-2 rounded-xl bg-acid text-black font-bold text-xs flex items-center gap-1.5 btn-tactile hover:brightness-105 cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Tambah Artis Lineup</span>
                    </button>
                  </div>

                  {showAddArtist && (
                    <form onSubmit={handleCreateArtist} className="p-6 rounded-2xl bg-[#171a24] border border-acid/30 space-y-4 shadow-xl">
                      <h5 className="text-xs font-bold text-acid uppercase font-mono">Form Tambah Artis Lineup</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Nama Artis / Grup</label>
                          <input
                            type="text"
                            required
                            value={artName}
                            onChange={(e) => setArtName(e.target.value)}
                            placeholder="Contoh: Stellar Horizon"
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-300 mb-1">Genre Musik</label>
                          <input
                            type="text"
                            required
                            value={artGenre}
                            onChange={(e) => setArtGenre(e.target.value)}
                            placeholder="Synthwave / Progressive House"
                            className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-acid"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddArtist(false)}
                          className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-zinc-300 btn-tactile cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-acid text-black font-bold text-xs btn-tactile cursor-pointer"
                        >
                          Simpan Artis
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {artists.map((art) => (
                      <div key={art.id} className="p-5 rounded-2xl bg-[#111319] border border-white/10 flex flex-col justify-between shadow-md">
                        <div>
                          <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-bold text-acid font-mono mb-3">
                            {art.name.slice(0, 2).toUpperCase()}
                          </div>
                          <h5 className="font-bold text-white text-base font-display">{art.name}</h5>
                          <span className="text-[11px] font-mono text-zinc-400 block mb-2 font-semibold">{art.genre}</span>
                          <p className="text-xs text-zinc-400 line-clamp-2">{art.bio || 'Headliner performance artis festival.'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
