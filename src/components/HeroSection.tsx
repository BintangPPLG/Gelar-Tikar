import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Ticket, Disc, Sparkle, MapPin, CalendarBlank } from '@phosphor-icons/react';
import { playClickBeep } from '../audio/synthAudio';

interface HeroSectionProps {
  onOpenTickets: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTickets }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Concert Stage Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero_stage.jpg"
          alt="Aurora Pulse Concert Stage"
          className="w-full h-full object-cover object-center opacity-35 scale-105 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/75 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090d]/60 to-[#08090d]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Headline, Subtext, and CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow Label */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-mono text-[#00f0ff] mb-4 border border-[#00f0ff]/30 shadow-sm"
          >
            <Sparkle size={14} weight="fill" className="text-[#00f0ff]" />
            <span>WORLD TOUR 2026 - JAKARTA MAIN EVENT</span>
          </motion.div>

          {/* Main Headline (Max 2 lines on desktop) */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white font-display uppercase mb-4"
          >
            Merasakan Getaran Suara <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff2a6d] to-[#ff9f1c]">Lintas Dimensi</span>
          </motion.h1>

          {/* Subtext (max 20 words) */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-300 max-w-[55ch] leading-relaxed mb-8"
          >
            Festival musik audio visual 360 spatial sound dengan 40+ artis dunia dan tata panggung laser termegah.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#tickets"
              onClick={() => {
                playClickBeep();
                onOpenTickets();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-extrabold text-sm uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-[#00f0ff]/25 cursor-pointer"
            >
              <Ticket size={20} weight="fill" />
              <span>Pesan Tiket Sekarang</span>
            </a>

            <a
              href="#lineup"
              onClick={() => playClickBeep()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl glass-pill text-zinc-200 hover:text-white hover:bg-white/10 active:scale-[0.98] text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <Disc size={20} className="text-[#ff2a6d]" />
              <span>Jelajahi Lineup</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Live Event Card with holographic style */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="lg:col-span-5 w-full"
        >
          <div className="relative rounded-2xl glass-panel p-6 sm:p-7 border border-white/15 overflow-hidden shadow-2xl">
            {/* Holographic accent glow */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#00f0ff]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#ff2a6d]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-5">
              {/* Event Badge Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                  <span>OFFICIAL WORLD TOUR</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">FASE 2 PRESALE</span>
              </div>

              {/* Event Metadata */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-zinc-200">
                  <CalendarBlank size={20} className="text-[#00f0ff] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white">18 - 20 Oktober 2026</div>
                    <div className="text-xs text-zinc-400">3 Hari Pertunjukan Lintas Panggung</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-zinc-200">
                  <MapPin size={20} className="text-[#ff2a6d] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white">Stadion Madya GBK</div>
                    <div className="text-xs text-zinc-400">Gelora Bung Karno, Jakarta Pusat</div>
                  </div>
                </div>
              </div>

              {/* Live Audio Visualizer Micro-Strip */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-zinc-400">360° SPATIAL SOUND</span>
                  <span className="text-xs font-bold text-white">128 Channel Dolby Live Arena</span>
                </div>
                <div className="flex items-end gap-1 h-6">
                  <span className="w-1 bg-[#00f0ff] rounded-full audio-bar-1" />
                  <span className="w-1 bg-[#00f0ff] rounded-full audio-bar-2" />
                  <span className="w-1 bg-[#ff2a6d] rounded-full audio-bar-3" />
                  <span className="w-1 bg-[#ff9f1c] rounded-full audio-bar-4" />
                  <span className="w-1 bg-[#00f0ff] rounded-full audio-bar-5" />
                </div>
              </div>

              {/* Quick Ticket Price Anchor */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Harga Mulai Dari</span>
                  <span className="text-xl font-extrabold text-white font-mono-num">
                    IDR 950.000
                  </span>
                </div>
                <a
                  href="#tickets"
                  onClick={() => playClickBeep()}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
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
