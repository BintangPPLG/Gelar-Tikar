import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, CheckCircle, Sparkle, Crown, Plus, Minus, ArrowRight } from '@phosphor-icons/react';
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
      'Akses VIP Air-Conditioned Lounge & Free Flow Drink',
      'Official Limited Edition Merch Boxset & Poster',
      'Akses Khusus Soundcheck Artis Terpilih',
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
      'Area Berdiri Tepat di Belakang VIP',
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
      'Pandangan Spektakuler Efek Laser & Panggung',
      'Akses Penuh ke Seluruh Panggung',
      'Fasilitas Toilet & F&B Khusus Tribun',
      'Official Smart LED Wristband Festival',
    ],
  },
  {
    id: '3day-pass',
    name: '3-Day All-Access Pass',
    badge: 'ULTIMATE EXPERIENCE',
    price: 4200000,
    formattedPrice: 'IDR 4.200.000',
    description: 'Tiket terusan 3 hari penuh untuk menyaksikan seluruh 40+ artis dan penutupan pesta kembang api.',
    quotaLabel: 'Edisi Terbatas',
    features: [
      'Akses Terusan 3 Hari (18-20 Oktober 2026)',
      'Fast-Track Entrance Setiap Hari',
      'Akses Eksklusif After-Party Penutupan',
      'Official Commemorative RFID Metal Wristband',
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
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono text-[#00f0ff] mb-4 border border-[#00f0ff]/30">
          <Sparkle size={14} weight="fill" />
          <span>TIKET RESMI & AMAN</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
          Pilihan <span className="text-[#00f0ff]">Kategori Tiket</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-3">
          Semua kategori tiket sudah termasuk pajak hiburan dan gelang RFID resmi festival.
        </p>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ticketTiers.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          const qty = quantities[tier.id] || 1;
          const totalPrice = tier.price * qty;

          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -6 }}
              onClick={() => handleSelectTier(tier.id)}
              className={`relative rounded-2xl glass-panel p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer border ${
                isSelected
                  ? 'border-[#00f0ff] shadow-2xl shadow-[#00f0ff]/20 ring-1 ring-[#00f0ff]'
                  : tier.isPopular
                  ? 'border-[#ff2a6d]/60'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Highlight ribbon */}
              {tier.isVip && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#ff2a6d] text-black font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                  <Crown size={12} weight="fill" />
                  <span>{tier.badge}</span>
                </div>
              )}

              {tier.isPopular && !tier.isVip && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#ff2a6d] text-white font-bold text-[10px] tracking-wider uppercase shadow-md">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#00f0ff]">{tier.quotaLabel}</span>
                  <Ticket size={18} className={isSelected ? 'text-[#00f0ff]' : 'text-zinc-500'} />
                </div>

                <h3 className="text-xl font-bold text-white font-display leading-snug mb-2">
                  {tier.name}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] text-zinc-400 block font-mono">HARGA SATUAN</span>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono-num">
                    {tier.formattedPrice}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-8">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <CheckCircle size={15} weight="fill" className="text-[#00f0ff] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Buy Action */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">Jumlah Tiket:</span>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg p-1">
                    <button
                      onClick={(e) => updateQuantity(tier.id, -1, e)}
                      className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10"
                    >
                      <Minus size={12} weight="bold" />
                    </button>
                    <span className="w-5 text-center font-mono font-bold text-xs text-white">
                      {qty}
                    </span>
                    <button
                      onClick={(e) => updateQuantity(tier.id, 1, e)}
                      className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10"
                    >
                      <Plus size={12} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Total calculation if qty > 1 */}
                {qty > 1 && (
                  <div className="flex justify-between text-xs font-mono text-zinc-300">
                    <span>Total ({qty} Tiket):</span>
                    <span className="text-[#00f0ff] font-bold">
                      IDR {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <button
                  onClick={(e) => handleBuyNow(tier, e)}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black shadow-lg shadow-[#00f0ff]/25 hover:brightness-110'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>Pesan Tiket</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
