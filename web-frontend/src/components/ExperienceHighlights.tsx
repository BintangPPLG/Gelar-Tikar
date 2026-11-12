import React from 'react';
import { SpeakerHigh, Sparkle, Broadcast, ForkKnife } from '@phosphor-icons/react';

export const ExperienceHighlights: React.FC = () => {
  return (
    <section id="experience" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
          Pengalaman <span className="text-acid">Festival Kelas Dunia</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Standar tata panggung dan kenyamanan festival bertaraf internasional di jantung kota Jakarta.
        </p>
      </div>

      {/* Bento Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cell 1: 360 Spatial Audio (8 cols) */}
        <div className="md:col-span-8 group relative rounded-3xl bg-[#111319] p-7 sm:p-9 border border-white/10 min-h-[300px] flex flex-col justify-between shadow-2xl">
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 text-acid flex items-center justify-center mb-5">
              <SpeakerHigh size={22} weight="bold" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
              360° Spatial Audio Soundscape
            </h3>
            <p className="text-sm text-zinc-300 max-w-lg leading-relaxed">
              128 titik speaker terkoordinasi melingkar di seluruh stadion, menghadirkan kedalaman audio surround tiga dimensi yang immersif tanpa distorsi.
            </p>
          </div>

          <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-acid font-bold">
              DOLBY LIVE CERTIFIED
            </span>
            <span className="text-zinc-600">•</span>
            <span>130dB CLEAN HEADROOM</span>
          </div>
        </div>

        {/* Cell 2: Pyro & Lasers (4 cols) with Concert Atmosphere Photo */}
        <div className="md:col-span-4 group relative rounded-3xl bg-[#111319] overflow-hidden border border-white/10 min-h-[300px] p-7 flex flex-col justify-end shadow-2xl">
          <img
            src="/assets/festival_atmosphere.jpg"
            alt="Laser and Pyro Show"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/50 to-transparent" />
          
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center justify-center mb-3">
              <Sparkle size={20} weight="fill" />
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-1.5">
              Laser & Pyrotechnics
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Sinkronisasi 64 unit laser RGB dan semburan piroteknik terprogram komputer.
            </p>
          </div>
        </div>

        {/* Cell 3: Smart RFID Wristband (4 cols) */}
        <div className="md:col-span-4 group relative rounded-3xl bg-[#111319] p-7 border border-white/10 min-h-[260px] flex flex-col justify-between shadow-2xl">
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 text-cobalt flex items-center justify-center mb-4">
              <Broadcast size={22} weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-2">
              Smart RFID Wristbands
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Gelang pintar yang berpendar serentak mengikuti beat musik dan berfungsi sebagai tiket masuk nirsentuh.
            </p>
          </div>
          <div className="text-[11px] font-mono text-cobalt font-bold">
            FAST-TRACK SCANNER READY
          </div>
        </div>

        {/* Cell 4: Curated Culinary Oasis (8 cols) */}
        <div className="md:col-span-8 group relative rounded-3xl bg-[#111319] p-7 sm:p-9 border border-white/10 min-h-[260px] flex flex-col justify-between shadow-2xl">
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 text-emerald-400 flex items-center justify-center mb-4">
              <ForkKnife size={22} weight="bold" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display mb-2">
              Curated F&B Village & Hydration Oasis
            </h3>
            <p className="text-sm text-zinc-300 max-w-lg leading-relaxed">
              Nikmati santapan artisan dari 30+ tenant pilihan, mocktail bar segar, serta stasiun pengisian air minum gratis di seluruh sudut venue.
            </p>
          </div>
          <div className="relative z-10 pt-4 flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="text-emerald-400 font-bold">30+ TENANT TERKURASI</span>
            <span className="text-zinc-600">•</span>
            <span>STASIUN HIDRASI GRATIS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
