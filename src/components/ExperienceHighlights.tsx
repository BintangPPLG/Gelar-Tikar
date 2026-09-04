import React from 'react';
import { SpeakerHigh, Sparkle, Broadcast, ForkKnife } from '@phosphor-icons/react';

export const ExperienceHighlights: React.FC = () => {
  return (
    <section id="experience" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display uppercase">
          Pengalaman <span className="text-[#00f0ff]">Festival Kelas Dunia</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Dirancang untuk memberikan standar hiburan tertinggi dengan teknologi konser mutakhir.
        </p>
      </div>

      {/* Bento Grid Highlights (4 diverse cells) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cell 1: 360 Spatial Audio (8 cols) */}
        <div className="md:col-span-8 group relative rounded-2xl glass-panel p-6 sm:p-8 border border-white/15 overflow-hidden min-h-[300px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/15 text-[#00f0ff] flex items-center justify-center mb-4">
              <SpeakerHigh size={22} weight="duotone" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display mb-2">
              360° Spatial Audio Soundscape
            </h3>
            <p className="text-sm text-zinc-300 max-w-md leading-relaxed">
              128 titik speaker terkoordinasi melingkar di seluruh stadion, menghadirkan kedalaman audio stereo surround tiga dimensi tanpa distorsi.
            </p>
          </div>

          <div className="relative z-10 pt-6 flex items-center gap-4 text-xs font-mono text-[#00f0ff]">
            <span className="px-3 py-1 rounded-full glass-pill border border-[#00f0ff]/30">
              DOLBY LIVE CERTIFIED
            </span>
            <span>130dB CLEAN HEADROOM</span>
          </div>
        </div>

        {/* Cell 2: Pyro & Lasers (4 cols) with Real Generated Concert Image */}
        <div className="md:col-span-4 group relative rounded-2xl glass-panel overflow-hidden border border-white/15 min-h-[300px] p-6 flex flex-col justify-end">
          <img
            src="/assets/festival_atmosphere.jpg"
            alt="Pyro and Laser Show"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/50 to-transparent" />
          
          <div className="relative z-10">
            <div className="w-9 h-9 rounded-lg bg-[#ff2a6d]/20 text-[#ff2a6d] flex items-center justify-center mb-3">
              <Sparkle size={20} weight="fill" />
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-1">
              Laser & Pyrotechnics
            </h3>
            <p className="text-xs text-zinc-300">
              Sinkronisasi 64 unit laser RGB dan semburan api spektakuler.
            </p>
          </div>
        </div>

        {/* Cell 3: Smart RFID Wristband (4 cols) */}
        <div className="md:col-span-4 group relative rounded-2xl glass-panel p-6 sm:p-7 border border-white/15 min-h-[260px] flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-9 h-9 rounded-lg bg-[#ff9f1c]/20 text-[#ff9f1c] flex items-center justify-center mb-4">
              <Broadcast size={20} weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-2">
              Smart RFID LED Wristbands
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Gelang pintar yang berpendar serentak mengikuti irama lagu dan berfungsi sebagai alat transaksi nirkabel nirsentuh.
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#ff9f1c]">
            CASHLESS PAYMENT READY
          </div>
        </div>

        {/* Cell 4: Curated Culinary Oasis (8 cols) */}
        <div className="md:col-span-8 group relative rounded-2xl glass-panel p-6 sm:p-8 border border-white/15 min-h-[260px] flex flex-col justify-between overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#10b981]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mb-4">
              <ForkKnife size={22} weight="duotone" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display mb-2">
              Curated F&B Village & Hydration
            </h3>
            <p className="text-sm text-zinc-300 max-w-lg leading-relaxed">
              Nikmati hidangan kuliner pilihan dari 30+ tenant artisan, cold brew coffee, mocktail bar, serta stasiun pengisian air mineral gratis di seluruh area festival.
            </p>
          </div>
          <div className="relative z-10 pt-4 flex items-center gap-3 text-xs font-mono text-[#10b981]">
            <span>30+ TENANT TERKURASI</span>
            <span>•</span>
            <span>FREE WATER STATIONS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
