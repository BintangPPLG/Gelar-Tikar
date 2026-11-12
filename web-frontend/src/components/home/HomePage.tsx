import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  MagnifyingGlass, 
  MapPin, 
  CalendarCheck, 
  Fire, 
  ShieldCheck, 
  QrCode, 
  CheckCircle, 
  Users, 
  Tag, 
  Star,
  ArrowRight
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { api, Event as EventType, TicketTier, Order } from '../../api/client';
import { playClickBeep, playSuccessChime } from '../../audio/synthAudio';

interface HomePageProps {
  onCheckout: (tier: TicketTier, event: EventType, qty: number) => void;
  onOpenMyTickets: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onCheckout,
  onOpenMyTickets,
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [allTiers, setAllTiers] = useState<TicketTier[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Selected event for expanded tier
  const [selectedTierByEvent, setSelectedTierByEvent] = useState<Record<number, number>>({});
  const [ticketQuantities, setTicketQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, tiersRes] = await Promise.all([
        api.events.getAll(),
        api.tickets.getAll(),
      ]);

      if (eventsRes.success && eventsRes.data) {
        setEvents(eventsRes.data);
      }
      if (tiersRes.success && tiersRes.data) {
        setAllTiers(tiersRes.data);
      }

      if (user?.email) {
        const ordersRes = await api.orders.getMyOrders(user.email);
        if (ordersRes.success && ordersRes.data) {
          setUserOrders(ordersRes.data);
        }
      }
    } catch (err) {
      console.error('Error loading homepage data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cities = [
    { id: 'all', label: 'Semua Kota' },
    { id: 'Jakarta', label: 'Jakarta' },
    { id: 'Bali', label: 'Bali' },
    { id: 'Bandung', label: 'Bandung' },
    { id: 'Surabaya', label: 'Surabaya' },
  ];

  // Filter events based on search query and city
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === 'all' ||
      ev.venue_address.toLowerCase().includes(selectedCity.toLowerCase()) ||
      ev.venue_name.toLowerCase().includes(selectedCity.toLowerCase()) ||
      ev.title.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesCity;
  });

  // Helper to format IDR currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getTiersForEvent = (eventId: number) => {
    return allTiers.filter((t) => t.event_id === eventId);
  };

  const handleSelectTierForEvent = (eventId: number, tierId: number) => {
    playClickBeep();
    setSelectedTierByEvent((prev) => ({ ...prev, [eventId]: tierId }));
  };

  const handleQtyChange = (eventId: number, delta: number) => {
    playClickBeep();
    const current = ticketQuantities[eventId] || 1;
    const updated = Math.max(1, Math.min(4, current + delta));
    setTicketQuantities((prev) => ({ ...prev, [eventId]: updated }));
  };

  const handleProceedCheckout = (event: EventType) => {
    playSuccessChime();
    const tiers = getTiersForEvent(event.id);
    const selectedTierId = selectedTierByEvent[event.id] || (tiers.length > 0 ? tiers[0].id : null);
    const tier = tiers.find((t) => t.id === selectedTierId) || tiers[0];
    const qty = ticketQuantities[event.id] || 1;

    if (tier) {
      onCheckout(tier, event, qty);
    }
  };

  const activePaidOrders = userOrders.filter((o) => o.status === 'paid');

  return (
    <div className="min-h-screen bg-[#08090c] text-zinc-100 pb-20 pt-28">
      {/* 1. HERO USER DASHBOARD BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative rounded-3xl overflow-hidden bg-[#111319] border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-acid" />
                <span>PORTAL RESMI ANGGOTA FESTIVAL 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white">
                Selamat Datang, <span className="text-acid">{user?.name || 'Festival Goer'}</span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Jelajahi konser live spatial audio, pesan tiket resmi terverifikasi dengan QR Code anti-calo, dan pantau e-ticket Anda secara real-time.
              </p>

              {/* Quick Actions Row */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    playClickBeep();
                    onOpenMyTickets();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-acid text-black font-bold text-xs sm:text-sm btn-tactile shadow-md shadow-acid/15 hover:brightness-105 cursor-pointer"
                >
                  <Ticket size={18} weight="fill" />
                  <span>E-Ticket & QR Saya ({activePaidOrders.length})</span>
                </button>
              </div>
            </div>

            {/* Member Metrics Card */}
            <div className="w-full lg:w-80 bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-zinc-400">STATUS AKUN</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                  ✓ TERVERIFIKASI
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[11px] font-mono text-zinc-400">Tiket Aktif</div>
                  <div className="text-2xl font-bold font-mono-num text-white">
                    {activePaidOrders.length} <span className="text-xs font-normal text-zinc-500">Tiket</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[11px] font-mono text-zinc-400">Total Konser</div>
                  <div className="text-2xl font-bold font-mono-num text-acid">
                    {events.length} <span className="text-xs font-normal text-zinc-500">Event</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5 pt-1">
                <ShieldCheck size={14} className="text-emerald-400" weight="fill" />
                <span>Sistem E-Ticket RFID Aktif 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RECENT ACTIVE TICKETS PREVIEW (IF ANY) */}
      {activePaidOrders.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-[#111319] border border-acid/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode size={20} className="text-acid" weight="fill" />
                <h3 className="font-bold font-display text-white text-base sm:text-lg">
                  Tiket Siap Pakai Anda
                </h3>
                <span className="text-xs font-mono bg-acid/10 text-acid px-2.5 py-0.5 rounded-full border border-acid/20">
                  Langsung Scan di Gate
                </span>
              </div>
              <button
                onClick={onOpenMyTickets}
                className="text-xs text-acid hover:underline flex items-center gap-1 font-mono font-bold btn-tactile cursor-pointer"
              >
                Lihat Semua ({activePaidOrders.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePaidOrders.slice(0, 3).map((order) => {
                const item = order.items?.[0];
                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      playClickBeep();
                      onOpenMyTickets();
                    }}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-acid/40 transition-all cursor-pointer group btn-tactile"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-acid transition-colors truncate">
                          {order.event_title || 'AURORA PULSE 2026'}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400">
                          {item?.tier_name || 'VIP Holographic Pass'}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                        PAID
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between pt-2 border-t border-white/5">
                      <span>Kode: {item?.ticket_code || order.order_code}</span>
                      <span className="text-acid flex items-center gap-1">
                        <QrCode size={13} /> Scan QR
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. SEARCH & CITY FILTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#111319] p-4 rounded-2xl border border-white/10">
          {/* Search Input */}
          <div className="relative flex-1">
            <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari konser, artis, festival, atau venue..."
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
            />
          </div>

          {/* City Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  playClickBeep();
                  setSelectedCity(city.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all btn-tactile cursor-pointer ${
                  selectedCity === city.id
                    ? 'bg-acid text-black shadow-md shadow-acid/20'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONCERT CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <Fire size={24} weight="fill" className="text-acid" />
              Daftar Konser & Tiket Tersedia
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Menampilkan {filteredEvents.length} konser musik resmi musim 2026-2027
            </p>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.03] border border-white/10">
            <Ticket size={40} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400 font-mono text-sm">Tidak ada konser yang cocok dengan pencarian Anda.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('all');
              }}
              className="mt-3 text-xs text-acid hover:underline font-bold font-mono"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event) => {
              const tiers = getTiersForEvent(event.id);
              const minPrice = tiers.length > 0 ? Math.min(...tiers.map((t) => t.price)) : 650000;
              const maxPrice = tiers.length > 0 ? Math.max(...tiers.map((t) => t.price)) : 4200000;
              const selectedTierId = selectedTierByEvent[event.id] || (tiers.length > 0 ? tiers[0].id : 1);
              const selectedTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];
              const qty = ticketQuantities[event.id] || 1;

              const eventDateObj = new Date(event.event_date);
              const formattedDate = isNaN(eventDateObj.getTime())
                ? '18 - 20 Oktober 2026'
                : eventDateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });

              return (
                <div
                  key={event.id}
                  className="rounded-3xl bg-[#111319] border border-white/10 hover:border-white/20 transition-all overflow-hidden shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Banner Image Header */}
                    <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={event.banner_url || '/assets/hero_stage.jpg'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                        onError={(e: any) => {
                          e.target.src = '/assets/hero_stage.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-[#111319]/40 to-transparent" />

                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-zinc-200 font-mono text-[11px] font-bold flex items-center gap-1.5">
                          <MapPin size={13} weight="fill" className="text-acid" />
                          {event.venue_name.split(' ')[0]}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-acid text-black font-mono text-[11px] font-bold">
                          OFFICIAL TICKET
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
                        <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md">
                          <CalendarCheck size={14} className="text-acid" />
                          {formattedDate}
                        </span>
                        <span className="bg-white/10 text-white px-2.5 py-1 rounded-lg font-bold border border-white/10">
                          {tiers.length} Kategori
                        </span>
                      </div>
                    </div>

                    {/* Event Body Info */}
                    <div className="p-6 sm:p-7">
                      <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white group-hover:text-acid transition-colors mb-2">
                        {event.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-5">
                        <MapPin size={16} className="text-acid shrink-0" />
                        <span className="truncate">{event.venue_name}, {event.venue_address}</span>
                      </div>

                      {/* Price Range Pill */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between mb-5">
                        <div>
                          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Mulai Dari</div>
                          <div className="text-lg font-bold font-mono-num text-white">
                            {formatIDR(minPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Maksimal</div>
                          <div className="text-sm font-bold font-mono-num text-acid">
                            {formatIDR(maxPrice)}
                          </div>
                        </div>
                      </div>

                      {/* TIER QUICK SELECTOR */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                          <span className="font-bold flex items-center gap-1.5">
                            <Tag size={14} className="text-acid" />
                            Pilih Kategori Pass:
                          </span>
                          <span className="text-zinc-500 text-[11px]">{tiers.length} Opsi</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {tiers.map((t) => {
                            const isSelected = selectedTierId === t.id;
                            const isSoldOut = t.status === 'sold_out' || t.sold_count >= t.total_quota;
                            return (
                              <button
                                key={t.id}
                                disabled={isSoldOut}
                                onClick={() => handleSelectTierForEvent(event.id, t.id)}
                                className={`p-3.5 rounded-2xl border text-left transition-all btn-tactile relative ${
                                  isSelected
                                    ? 'bg-acid/15 border-acid text-white shadow-md shadow-acid/10'
                                    : 'bg-black/40 border-white/10 hover:border-white/25 text-zinc-300'
                                } ${isSoldOut ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <div className="flex items-center justify-between text-xs font-bold mb-1">
                                  <span className="truncate pr-2">{t.name}</span>
                                  {isSelected && <CheckCircle size={14} weight="fill" className="text-acid shrink-0" />}
                                </div>
                                <div className="text-xs font-mono text-acid font-bold">
                                  {formatIDR(t.price)}
                                </div>
                                <div className="text-[10px] font-mono text-zinc-400 mt-1">
                                  {isSoldOut ? 'HABIS (Sold Out)' : `Tersisa ${t.total_quota - t.sold_count} tiket`}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Tier Perks Snippet */}
                        {selectedTier && (
                          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 text-xs space-y-1">
                            <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                              <Star size={13} className="text-acid" weight="fill" />
                              <span>Fasilitas {selectedTier.name}:</span>
                            </div>
                            <p className="text-zinc-300 text-[11px] leading-relaxed">
                              {selectedTier.description || 'Akses resmi panggung utama, RFID smart wristband, dan dynamic e-ticket.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Checkout Bar */}
                  <div className="p-6 sm:p-7 pt-0">
                    <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => handleQtyChange(event.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 font-bold btn-tactile"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-white">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(event.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 font-bold btn-tactile"
                        >
                          +
                        </button>
                      </div>

                      {/* Primary Buy Button */}
                      <button
                        onClick={() => handleProceedCheckout(event)}
                        className="flex-1 py-3.5 px-4 rounded-xl bg-acid text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-acid/20 btn-tactile hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Ticket size={16} weight="fill" />
                        <span>Pesan {qty} Tiket Sekarang</span>
                        <ArrowRight size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. FESTIVAL SECURITY GUARANTEES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#111319] border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold font-display text-white">
              Standar Keamanan Tiket AURORA PULSE
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Setiap tiket terenkripsi resmi dan terhubung langsung ke gerbang gate Stadion Madya GBK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-acid flex items-center justify-center">
                <QrCode size={22} weight="fill" />
              </div>
              <h4 className="font-bold text-white text-sm font-display">Dynamic QR E-Ticket</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Kode QR dinamis terlindungi enkripsi untuk mencegah calo dan pemalsuan tiket di gerbang masuk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-cobalt flex items-center justify-center">
                <ShieldCheck size={22} weight="fill" />
              </div>
              <h4 className="font-bold text-white text-sm font-display">Jaminan 100% Akses Resmi</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tiket terdaftar resmi atas identitas pembeli dan diverifikasi secara instan melalui sistem promotor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-zinc-300 flex items-center justify-center">
                <Users size={22} weight="fill" />
              </div>
              <h4 className="font-bold text-white text-sm font-display">Layanan Bantuan 24/7</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tim helpdesk siap menangani kendala verifikasi tiket, pergantian pengunjung, dan penukaran wristband fisik.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
