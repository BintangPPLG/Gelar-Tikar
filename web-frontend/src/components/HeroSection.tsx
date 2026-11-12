import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Ticket, Disc, MapPin, CalendarBlank, ArrowRight } from '@phosphor-icons/react';
import { playClickBeep } from '../audio/synthAudio';

interface HeroSectionProps {
  onOpenTickets: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTickets }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[96dvh] flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Concert Atmospheric Backdrop */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="/assets/hero_stage.jpg"
          alt="Aurora Pulse Concert Stage"
          className="w-full h-full object-cover object-center opacity-30 scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/70 to-[#08090c]/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090c]/50 to-[#08090c]" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Festival Manifesto & Action */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Status Eyebrow Badge */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
            <span className="text-zinc-400 font-bold">FASE 2 PRESALE</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300">JAKARTA EDITION</span>
          </motion.div>

          {/* Main Headline (Masif & Editorial) */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.04] text-white font-display uppercase mb-5"
          >
            Merasakan Getaran Suara <span className="text-acid">360° Spatial Audio</span>
          </motion.h1>

          {/* Concise Value Subtext (Under 20 words) */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="text-base sm:text-lg text-zinc-300 max-w-[50ch] leading-relaxed mb-8"
          >
            Festival musik elektronik dengan 128 titik audio terkoordinasi dan 40+ musisi internasional di Stadion Madya GBK.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#tickets"
              onClick={() => {
                playClickBeep();
                onOpenTickets();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-acid text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-acid/20 btn-tactile hover:brightness-105 cursor-pointer"
            >
              <Ticket size={18} weight="fill" />
              <span>Pesan Tiket Sekarang</span>
              <ArrowRight size={15} weight="bold" />
            </a>

            <a
              href="#lineup"
              onClick={() => playClickBeep()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/25 text-zinc-200 hover:text-white text-sm font-semibold btn-tactile cursor-pointer"
            >
              <Disc size={18} className="text-zinc-400" />
              <span>Jelajahi Lineup Artis</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Physical Ticket / Festival Pass Stub Card */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-5 w-full"
        >
          <div className="relative rounded-2xl bg-[#111319] border border-white/10 overflow-hidden shadow-2xl shadow-black/80">
            {/* Top Pass Banner */}
            <div className="bg-[#171a24] px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-acid" />
                <span className="text-xs font-mono font-bold tracking-wider text-white">
                  OFFICIAL ACCESS PASS
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2.5 py-0.5 rounded border border-white/5">
                RFID READY
              </span>
            </div>

            {/* Pass Body */}
            <div className="p-6 sm:p-7 flex flex-col gap-6">
              {/* Event Schedule Info */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3 text-zinc-200">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-acid shrink-0">
                    <CalendarBlank size={16} weight="bold" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">18 - 20 Oktober 2026</div>
                    <div className="text-xs text-zinc-400">3 Hari Pertunjukan Lintas 3 Panggung</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-zinc-200">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cobalt shrink-0">
                    <MapPin size={16} weight="bold" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Stadion Madya GBK</div>
                    <div className="text-xs text-zinc-400">Gelora Bung Karno, Jakarta Pusat</div>
                  </div>
                </div>
              </div>

              {/* Perforation Divider Line */}
              <div className="ticket-divider-dashed my-1" />

              {/* Audio Technology Meter */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">
                    SPATIAL SOUND ENGINE
                  </span>
                  <span className="text-xs font-bold text-white">
                    128 Channel Dolby Live Arena
                  </span>
                </div>
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 bg-acid rounded-full audio-bar-1" />
                  <span className="w-1 bg-acid rounded-full audio-bar-2" />
                  <span className="w-1 bg-zinc-300 rounded-full audio-bar-3" />
                  <span className="w-1 bg-cobalt rounded-full audio-bar-4" />
                  <span className="w-1 bg-acid rounded-full audio-bar-5" />
                </div>
              </div>

              {/* Price & Action Strip */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[11px] text-zinc-400 block font-mono">
                    Harga Mulai Dari
                  </span>
                  <span className="text-2xl font-black text-white font-mono-num tracking-tight">
                    IDR 950.000
                  </span>
                </div>
                <a
                  href="#tickets"
                  onClick={() => {
                    playClickBeep();
                    onOpenTickets();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-acid hover:text-black text-xs font-bold text-white transition-all btn-tactile cursor-pointer"
                >
                  Pilih Kategori
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
