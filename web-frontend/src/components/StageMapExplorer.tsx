import React, { useState } from 'react';
import { CheckCircle, MapPin, Users, SpeakerHigh } from '@phosphor-icons/react';
import { playClickBeep } from '../audio/synthAudio';

interface ZoneInfo {
  id: string;
  name: string;
  category: string;
  viewDesc: string;
  acoustics: string;
  capacity: string;
  price: string;
  color: string;
  perks: string[];
}

const zones: Record<string, ZoneInfo> = {
  vip: {
    id: 'vip',
    name: 'VIP Cosmic Front & Lounge',
    category: 'VIP Pass',
    viewDesc: 'Area eksklusif tepat di depan panggung utama dengan baris terdepan dan akses VIP air-conditioned lounge.',
    acoustics: '100% Immersive Spatial Sweetspot',
    capacity: '1.500 Orang',
    price: 'IDR 2.850.000',
    color: '#d4ff00',
    perks: ['Fast Track Entrance', 'Akses Backstage Lounge', 'Official Festival Merch Pack', 'Free Flow Mineral Water'],
  },
  cat1: {
    id: 'cat1',
    name: 'CAT 1 Festival Standing',
    category: 'Standing Zone',
    viewDesc: 'Area berdiri langsung di belakang VIP dengan pandangan penuh ke tata laser dan sound stage berkekuatan penuh.',
    acoustics: '95% Dolby Live Dynamic',
    capacity: '8.000 Orang',
    price: 'IDR 1.650.000',
    color: '#3b82f6',
    perks: ['Pandangan Panggung Menyeluruh', 'Akses Dekat F&B Oasis', 'Spot Foto Tata Cahaya Laser'],
  },
  cat2: {
    id: 'cat2',
    name: 'CAT 2 Tribune Seating',
    category: 'Numbered Seating',
    viewDesc: 'Kursi tribun bernomor dengan sudut pandang panggung spektakuler dan atap kanopi berbayang.',
    acoustics: '90% Arena Surround Sound',
    capacity: '12.000 Orang',
    price: 'IDR 950.000',
    color: '#a1a1aa',
    perks: ['Nomor Kursi Tetap Beratap', 'Sudut Pandang Panoramik', 'Akses Toilet & F&B Khusus Tribun'],
  },
  fnb: {
    id: 'fnb',
    name: 'Culinary & F&B Oasis',
    category: 'Festival Area',
    viewDesc: 'Pusat kuliner terkurasi dengan 30+ tenant artisan pilihan, mocktail bar, dan resting zone nyaman.',
    acoustics: 'Ambient Festival Soundscape',
    capacity: '3.000 Orang',
    price: 'Akses Semua Kategori',
    color: '#10b981',
    perks: ['30+ Kuliner Pilihan', 'Hydration Station Gratis', 'Area Duduk Kanopi'],
  },
};

export const StageMapExplorer: React.FC = () => {
  const [activeZoneKey, setActiveZoneKey] = useState<string>('vip');

  const handleZoneSelect = (key: string) => {
    playClickBeep();
    setActiveZoneKey(key);
  };

  const activeZone = zones[activeZoneKey] || zones.vip;

  return (
    <section id="venue" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
          Peta Venue & <span className="text-acid">Tata Panggung</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Denah interaktif Stadion Madya GBK dengan tata letak akustik modern untuk kenyamanan seluruh penonton.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive SVG Arena Map (7 Columns) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#111319] p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
          <div className="text-xs font-mono text-zinc-400 mb-6 flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
              KLIK ZONA PADA PETA UNTUK DETAIL
            </span>
            <span className="text-white font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
              STADION MADYA GBK
            </span>
          </div>

          {/* SVG Map Layout */}
          <div className="w-full max-w-lg aspect-[4/3] relative">
            <svg
              viewBox="0 0 600 450"
              className="w-full h-full select-none"
            >
              {/* Outer Stadium Track */}
              <ellipse
                cx="300"
                cy="225"
                rx="280"
                ry="200"
                fill="#0d0e14"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
              />

              {/* CAT 2: Tribune Seating Ring */}
              <ellipse
                cx="300"
                cy="225"
                rx="255"
                ry="175"
                fill={activeZoneKey === 'cat2' ? 'rgba(161, 161, 170, 0.25)' : 'rgba(255, 255, 255, 0.03)'}
                stroke={activeZoneKey === 'cat2' ? '#a1a1aa' : 'rgba(255,255,255,0.1)'}
                strokeWidth={activeZoneKey === 'cat2' ? '2.5' : '1'}
                strokeDasharray="6 4"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleZoneSelect('cat2')}
              />

              {/* Inner Infield Area */}
              <ellipse
                cx="300"
                cy="235"
                rx="195"
                ry="130"
                fill="#151722"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
              />

              {/* CAT 1: Festival Standing Area */}
              <rect
                x="150"
                y="170"
                width="300"
                height="125"
                rx="16"
                fill={activeZoneKey === 'cat1' ? 'rgba(59, 130, 246, 0.28)' : 'rgba(59, 130, 246, 0.08)'}
                stroke={activeZoneKey === 'cat1' ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'}
                strokeWidth={activeZoneKey === 'cat1' ? '2.5' : '1'}
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleZoneSelect('cat1')}
              />
              <text
                x="300"
                y="240"
                fill="#93c5fd"
                fontSize="12"
                fontWeight="bold"
                fontFamily="Space Grotesk, sans-serif"
                textAnchor="middle"
                className="pointer-events-none tracking-wider"
              >
                CAT 1 FESTIVAL STANDING
              </text>

              {/* VIP Moshpit (Right in front of stage) */}
              <rect
                x="180"
                y="115"
                width="240"
                height="45"
                rx="10"
                fill={activeZoneKey === 'vip' ? 'rgba(212, 255, 0, 0.3)' : 'rgba(212, 255, 0, 0.1)'}
                stroke={activeZoneKey === 'vip' ? '#d4ff00' : 'rgba(212, 255, 0, 0.4)'}
                strokeWidth={activeZoneKey === 'vip' ? '2.5' : '1.5'}
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleZoneSelect('vip')}
              />
              <text
                x="300"
                y="143"
                fill="#d4ff00"
                fontSize="11"
                fontWeight="bold"
                fontFamily="Space Grotesk, sans-serif"
                textAnchor="middle"
                className="pointer-events-none tracking-wider"
              >
                VIP FRONT ROW ZONE
              </text>

              {/* Main Stage Enclosure */}
              <path
                d="M 200 65 L 400 65 L 420 100 L 180 100 Z"
                fill="#222736"
                stroke="#d4ff00"
                strokeWidth="1.5"
              />
              <text
                x="300"
                y="88"
                fill="#ffffff"
                fontSize="13"
                fontWeight="bold"
                fontFamily="Space Grotesk, sans-serif"
                textAnchor="middle"
                className="pointer-events-none tracking-wider"
              >
                ★ MAINFRAME STAGE ★
              </text>

              {/* F&B Oasis Zone (Lower bottom) */}
              <rect
                x="190"
                y="310"
                width="220"
                height="40"
                rx="8"
                fill={activeZoneKey === 'fnb' ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.08)'}
                stroke={activeZoneKey === 'fnb' ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}
                strokeWidth={activeZoneKey === 'fnb' ? '2.5' : '1'}
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleZoneSelect('fnb')}
              />
              <text
                x="300"
                y="335"
                fill="#6ee7b7"
                fontSize="10"
                fontWeight="bold"
                fontFamily="Space Grotesk, sans-serif"
                textAnchor="middle"
                className="pointer-events-none tracking-wider"
              >
                CULINARY & F&B OASIS
              </text>
            </svg>
          </div>

          {/* Quick Zone Switch Pills */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center w-full">
            {Object.values(zones).map((z) => (
              <button
                key={z.id}
                onClick={() => handleZoneSelect(z.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all btn-tactile cursor-pointer ${
                  activeZoneKey === z.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {z.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Zone Detail Card (5 Columns) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#111319] p-7 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs font-mono px-3 py-1 rounded-full font-bold uppercase"
              style={{
                backgroundColor: `${activeZone.color}15`,
                color: activeZone.color,
                border: `1px solid ${activeZone.color}35`,
              }}
            >
              {activeZone.category}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {activeZone.capacity}
            </span>
          </div>

          <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-2">
            {activeZone.name}
          </h3>

          <p className="text-sm text-zinc-300 leading-relaxed mb-6">
            {activeZone.viewDesc}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-zinc-400 block mb-1">
                KUALITAS AKUSTIK
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <SpeakerHigh size={14} className="text-acid" />
                <span>{activeZone.acoustics}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-zinc-400 block mb-1">
                STANDAR HARGA
              </span>
              <div className="text-xs font-bold text-acid font-mono-num">
                {activeZone.price}
              </div>
            </div>
          </div>

          {/* Perks */}
          <div className="space-y-2.5 pt-4 border-t border-white/10">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
              FASILITAS & BENEFIT ZONA:
            </span>
            {activeZone.perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-200">
                <CheckCircle size={15} weight="fill" className="text-acid shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
