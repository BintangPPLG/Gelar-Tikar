import React, { useState } from 'react';
import { SpeakerHigh, Users, ShieldCheck } from '@phosphor-icons/react';
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
    name: 'VIP Cosmic Moshpit & Lounge',
    category: 'VIP Pass',
    viewDesc: 'Area eksklusif tepat di depan panggung utama dengan akses baris terdepan dan lounge ber-AC.',
    acoustics: '100% Immersive Spatial Sweetspot',
    capacity: '1.500 Orang',
    price: 'IDR 2.850.000',
    color: '#00f0ff',
    perks: ['Fast Track Entrance', 'Akses Backstage Lounge', 'Official Festival Merch Pack', 'Free Flow Mineral Water'],
  },
  cat1: {
    id: 'cat1',
    name: 'CAT 1 Festival Standing',
    category: 'Standing Zone',
    viewDesc: 'Area berdiri langsung di belakang VIP dengan pandangan penuh ke tata laser dan efek visual megah.',
    acoustics: '95% Dolby Live Dynamic',
    capacity: '8.000 Orang',
    price: 'IDR 1.650.000',
    color: '#ff2a6d',
    perks: ['Pandangan Panggung Luas', 'Akses Dekat F&B Oasis', 'Spot Foto Laser Utama'],
  },
  cat2: {
    id: 'cat2',
    name: 'CAT 2 Tribune Seating',
    category: 'Numbered Seating',
    viewDesc: 'Kursi tribun bernomor dengan sudut pandang panggung spektakuler dan atap kanopi berbayang.',
    acoustics: '90% Arena Surround Sound',
    capacity: '12.000 Orang',
    price: 'IDR 950.000',
    color: '#ff9f1c',
    perks: ['Nomor Kursi Tetap', 'Atap Kanopi Terlindung', 'Akses Toilet & F&B Khusus'],
  },
  fnb: {
    id: 'fnb',
    name: 'Culinary & F&B Oasis',
    category: 'Festival Area',
    viewDesc: 'Pusat kuliner terkurasi dengan 30+ tenant makanan dan minuman artisan ternama.',
    acoustics: 'Ambient Festival Music',
    capacity: '3.000 Orang',
    price: 'Akses Semua Kategori',
    color: '#10b981',
    perks: ['30+ Kuliner Pilihan', 'Hydration Station Gratis', 'Area Duduk Nyaman'],
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
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display uppercase">
          Peta Venue & <span className="text-[#00f0ff]">Tata Panggung</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Stadion Madya GBK dirancang dengan tata letak akustik modern untuk kenyamanan maksimal seluruh penonton.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive SVG Arena Map (7 Columns) */}
        <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border border-white/15 relative overflow-hidden flex flex-col items-center justify-center">
          <div className="text-xs font-mono text-zinc-400 mb-4 flex items-center justify-between w-full">
            <span>KLIK ZONA UNTUK MELIHAT DETAIL</span>
            <span className="text-[#00f0ff] font-bold">STADION MADYA GBK</span>
          </div>

          {/* SVG Map Layout */}
          <div className="w-full max-w-lg aspect-[4/3] relative">
            <svg
              viewBox="0 0 600 450"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))' }}
            >
              {/* Arena Outer Boundary */}
              <path
                d="M 50 150 Q 300 30 550 150 L 550 380 Q 300 440 50 380 Z"
                fill="#0d1017"
                stroke="#2a3040"
                strokeWidth="2"
              />

              {/* Main Stage Rectangle */}
              <g className="cursor-pointer" onClick={() => handleZoneSelect('vip')}>
                <rect
                  x="200"
                  y="60"
                  width="200"
                  height="45"
                  rx="6"
                  fill="#00f0ff"
                  opacity="0.85"
                />
                <text
                  x="300"
                  y="88"
                  textAnchor="middle"
                  fill="#08090d"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  AURORA MAINFRAME STAGE
                </text>
              </g>

              {/* VIP Cosmic Moshpit Zone */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => handleZoneSelect('vip')}
              >
                <path
                  d="M 180 120 L 420 120 L 440 190 L 160 190 Z"
                  fill={activeZoneKey === 'vip' ? '#00f0ff' : 'rgba(0, 240, 255, 0.2)'}
                  stroke="#00f0ff"
                  strokeWidth={activeZoneKey === 'vip' ? '3' : '1.5'}
                />
                <text
                  x="300"
                  y="160"
                  textAnchor="middle"
                  fill={activeZoneKey === 'vip' ? '#08090d' : '#ffffff'}
                  fontSize="12"
                  fontWeight="bold"
                >
                  VIP COSMIC MOSHPIT
                </text>
              </g>

              {/* CAT 1 Festival Standing Zone */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => handleZoneSelect('cat1')}
              >
                <path
                  d="M 150 205 L 450 205 L 480 290 L 120 290 Z"
                  fill={activeZoneKey === 'cat1' ? '#ff2a6d' : 'rgba(255, 42, 109, 0.2)'}
                  stroke="#ff2a6d"
                  strokeWidth={activeZoneKey === 'cat1' ? '3' : '1.5'}
                />
                <text
                  x="300"
                  y="252"
                  textAnchor="middle"
                  fill={activeZoneKey === 'cat1' ? '#08090d' : '#ffffff'}
                  fontSize="12"
                  fontWeight="bold"
                >
                  CAT 1 FESTIVAL STANDING
                </text>
              </g>

              {/* CAT 2 Tribune Seating (Surrounding semi-circle) */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => handleZoneSelect('cat2')}
              >
                <path
                  d="M 80 160 Q 300 70 520 160 L 540 370 Q 300 425 60 370 Z"
                  fill={activeZoneKey === 'cat2' ? 'rgba(255, 159, 28, 0.35)' : 'rgba(255, 159, 28, 0.08)'}
                  stroke="#ff9f1c"
                  strokeWidth={activeZoneKey === 'cat2' ? '3' : '1.5'}
                  strokeDasharray="6 4"
                />
                <text
                  x="300"
                  y="350"
                  textAnchor="middle"
                  fill={activeZoneKey === 'cat2' ? '#ff9f1c' : '#a1a1aa'}
                  fontSize="12"
                  fontWeight="bold"
                >
                  CAT 2 TRIBUNE SEATING
                </text>
              </g>

              {/* F&B Oasis Zone */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => handleZoneSelect('fnb')}
              >
                <rect
                  x="80"
                  y="295"
                  width="110"
                  height="45"
                  rx="6"
                  fill={activeZoneKey === 'fnb' ? '#10b981' : 'rgba(16, 185, 129, 0.2)'}
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <text
                  x="135"
                  y="322"
                  textAnchor="middle"
                  fill={activeZoneKey === 'fnb' ? '#08090d' : '#ffffff'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  F&B OASIS
                </text>
              </g>

              {/* Official Merchandise */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => handleZoneSelect('fnb')}
              >
                <rect
                  x="410"
                  y="295"
                  width="110"
                  height="45"
                  rx="6"
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <text
                  x="465"
                  y="322"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  MERCH & CHILL
                </text>
              </g>
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-white/10 w-full text-xs font-mono">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-3 h-3 rounded-sm bg-[#00f0ff]" />
              <span>VIP Pass</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-3 h-3 rounded-sm bg-[#ff2a6d]" />
              <span>CAT 1 Standing</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-3 h-3 rounded-sm bg-[#ff9f1c]" />
              <span>CAT 2 Tribune</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-3 h-3 rounded-sm bg-[#10b981]" />
              <span>F&B / Hub</span>
            </div>
          </div>
        </div>

        {/* Selected Zone Inspector Details (5 Columns) */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-6 sm:p-7 border border-white/15">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <span
              className="text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full"
              style={{ backgroundColor: `${activeZone.color}20`, color: activeZone.color }}
            >
              {activeZone.category}
            </span>
            <span className="text-sm font-extrabold text-white font-mono-num">
              {activeZone.price}
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-white font-display mb-3">
            {activeZone.name}
          </h3>

          <p className="text-sm text-zinc-300 leading-relaxed mb-6">
            {activeZone.viewDesc}
          </p>

          <div className="space-y-3 mb-6 bg-black/30 p-4 rounded-xl border border-white/5 text-xs">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-2 text-zinc-400">
                <SpeakerHigh size={16} className="text-[#00f0ff]" />
                Kualitas Akustik:
              </span>
              <span className="font-semibold text-white">{activeZone.acoustics}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-2 text-zinc-400">
                <Users size={16} className="text-[#ff9f1c]" />
                Kapasitas Area:
              </span>
              <span className="font-semibold text-white">{activeZone.capacity}</span>
            </div>
          </div>

          {/* Perks list */}
          <div className="mb-6">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
              Fasilitas Termasuk
            </div>
            <ul className="space-y-2">
              {activeZone.perks.map((perk, i) => (
                <li key={i} className="text-xs text-zinc-200 flex items-center gap-2">
                  <ShieldCheck size={16} weight="fill" className="text-[#00f0ff] shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#tickets"
            onClick={() => playClickBeep()}
            className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-[#00f0ff]/20"
          >
            Pilih Kategori Ini
          </a>
        </div>
      </div>
    </section>
  );
};
