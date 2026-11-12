import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, CheckCircle, Crown, Plus, Minus, ArrowRight } from '@phosphor-icons/react';
import { playClickBeep } from '../audio/synthAudio';

export interface TicketTier {
  id: string;
  name: string;
  badge: string;
  price: number;
  formattedPrice: string;
  description: string;
  quotaLabel: string;
  isPopular?: boolean;
  isVip?: boolean;
  features: string[];
}

const ticketTiers: TicketTier[] = [
  {
    id: 'vip-pass',
    name: 'VIP Cosmic Holographic Pass',
    badge: 'MOST EXCLUSIVE',
    price: 2850000,
    formattedPrice: 'IDR 2.850.000',
    description: 'Akses baris terdepan dengan fasilitas lounge eksklusif dan merchandise resmi festival.',
    quotaLabel: 'Sisa 85 Tiket',
    isVip: true,
    features: [
      'Akses Baris Paling Depan Main Stage',
      'Fast-Track VIP Entrance & Antrian Khusus',
      'Akses VIP AC Lounge & Free Flow Drink',
      'Official Limited Merch Boxset & Poster',
      'Akses Soundcheck Artis Terpilih',
    ],
  },
  {
    id: 'cat-1',
    name: 'CAT 1 Front Standing',
    badge: 'FAVORIT PENONTON',
    price: 1650000,
    formattedPrice: 'IDR 1.650.000',
    description: 'Pengalaman festival terbaik di area berdiri dengan akustik 360 spatial audio paling bertenaga.',
    quotaLabel: 'Presale 2 Hampir Habis',
    isPopular: true,
    features: [
      'Area Berdiri di Belakang VIP',
      'Akses Penuh ke 3 Panggung Festival',
      'Sound Stage 360 Spatial Audio Sweetspot',
      'Akses Zona F&B Oasis & Merchandise',
      'Official Smart LED Wristband Festival',
    ],
  },
  {
    id: 'cat-2',
    name: 'CAT 2 Tribune Seating',
    badge: 'NUMBERED SEATS',
    price: 950000,
    formattedPrice: 'IDR 950.000',
    description: 'Kenyamanan tempat duduk bernomor di tribun beratap dengan pandangan menyeluruh panggung.',
    quotaLabel: 'Tersedia',
    features: [
      'Nomor Kursi Tetap Berkanopi (Anti Hujan)',
      'Pandangan Spektakuler Efek Laser',
      'Akses Penuh ke Seluruh Panggung',
      'Fasilitas Toilet & F&B Khusus Tribun',
      'Official Smart LED Wristband Festival',
    ],
  },
  {
    id: '3day-pass',
    name: '3-Day All-Access Pass',
    badge: 'ULTIMATE PASS',
    price: 4200000,
    formattedPrice: 'IDR 4.200.000',
    description: 'Tiket terusan 3 hari penuh untuk menyaksikan seluruh 40+ artis dan penutupan pesta kembang api.',
    quotaLabel: 'Edisi Terbatas',
    features: [
      'Akses Terusan 3 Hari (18-20 Oktober)',
      'Fast-Track Entrance Setiap Hari',
      'Akses Eksklusif After-Party Penutupan',
      'Commemorative RFID Metal Wristband',
      'Prioritas Antrian Merchandise & F&B',
    ],
  },
];

interface TicketPassSelectorProps {
  onCheckout: (tier: TicketTier, quantity: number) => void;
}

export const TicketPassSelector: React.FC<TicketPassSelectorProps> = ({ onCheckout }) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('cat-1');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'vip-pass': 1,
    'cat-1': 1,
    'cat-2': 1,
    '3day-pass': 1,
  });

  const handleSelectTier = (id: string) => {
    playClickBeep();
    setSelectedTierId(id);
  };

  const updateQuantity = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickBeep();
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(6, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleBuyNow = (tier: TicketTier, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickBeep();
    const qty = quantities[tier.id] || 1;
    onCheckout(tier, qty);
  };

  return (
    <section id="tickets" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
          Kategori & <span className="text-acid">Pass Masuk</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-3">
          Semua kategori tiket sudah termasuk pajak hiburan resmi dan gelang RFID sensorik.
        </p>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ticketTiers.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          const qty = quantities[tier.id] || 1;
          const totalPrice = tier.price * qty;

          return (
            <div
              key={tier.id}
              onClick={() => handleSelectTier(tier.id)}
              className={`relative rounded-3xl bg-[#111319] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'border-acid shadow-2xl shadow-acid/15 ring-1 ring-acid'
                  : tier.isPopular
                  ? 'border-cobalt/60 hover:border-cobalt'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge */}
              {tier.isVip && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-acid text-black font-extrabold font-mono text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md shadow-acid/20">
                  <Crown size={12} weight="fill" />
                  <span>{tier.badge}</span>
                </div>
              )}

              {tier.isPopular && !tier.isVip && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-cobalt text-white font-extrabold font-mono text-[10px] tracking-wider uppercase shadow-md shadow-cobalt/20">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Header Stub */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-zinc-400 font-bold">{tier.quotaLabel}</span>
                  <Ticket size={18} className={isSelected ? 'text-acid' : 'text-zinc-500'} />
                </div>

                <h3 className="text-xl font-bold text-white font-display leading-snug mb-2">
                  {tier.name}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="mb-5 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-zinc-400 block font-mono mb-0.5">
                    HARGA RESMI SATUAN
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono-num tracking-tight">
                    {tier.formattedPrice}
                  </div>
                </div>

                {/* Perforation Divider */}
                <div className="ticket-divider-dashed my-4" />

                {/* Features List */}
                <div className="space-y-2.5 mb-8">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <CheckCircle size={15} weight="fill" className="text-acid shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Checkout Action */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">Jumlah:</span>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={(e) => updateQuantity(tier.id, -1, e)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 btn-tactile"
                    >
                      <Minus size={12} weight="bold" />
                    </button>
                    <span className="w-5 text-center font-mono font-bold text-xs text-white">
                      {qty}
                    </span>
                    <button
                      onClick={(e) => updateQuantity(tier.id, 1, e)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 btn-tactile"
                    >
                      <Plus size={12} weight="bold" />
                    </button>
                  </div>
                </div>

                {qty > 1 && (
                  <div className="flex justify-between text-xs font-mono text-zinc-300">
                    <span>Total ({qty} Tiket):</span>
                    <span className="text-acid font-bold">
                      IDR {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <button
                  onClick={(e) => handleBuyNow(tier, e)}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all btn-tactile cursor-pointer ${
                    isSelected
                      ? 'bg-acid text-black shadow-lg shadow-acid/20 hover:brightness-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>Pesan Tiket</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
