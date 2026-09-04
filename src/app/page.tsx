'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'motion/react';
import { WelcomeIntro } from '@/components/WelcomeIntro';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { LiveStatusBar } from '@/components/LiveStatusBar';
import { LineupBento } from '@/components/LineupBento';
import { StageMapExplorer } from '@/components/StageMapExplorer';
import { TicketPassSelector } from '@/components/TicketPassSelector';
import type { TicketTier } from '@/components/TicketPassSelector';
import { ExperienceHighlights } from '@/components/ExperienceHighlights';
import { FestivalFaq } from '@/components/FestivalFaq';
import { Footer } from '@/components/Footer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { stopArtistAudioPreview } from '@/audio/synthAudio';

export default function HomePage() {
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [checkoutTier, setCheckoutTier] = useState<TicketTier | null>(null);
  const [checkoutQty, setCheckoutQty] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const handleOpenCheckout = (tier: TicketTier, qty: number = 1) => {
    setCheckoutTier(tier);
    setCheckoutQty(qty);
    setIsCheckoutOpen(true);
  };

  const handleToggleAudio = () => {
    if (!isAudioMuted) {
      stopArtistAudioPreview();
    }
    setIsAudioMuted(!isAudioMuted);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 relative">
      {/* Welcome Intro Screen */}
      <AnimatePresence>
        {showIntro && (
          <WelcomeIntro onEnter={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Top Admin Quick Bar */}
      <div className="bg-[#0b0d14] border-b border-white/10 px-4 py-1.5 text-center text-[11px] font-mono text-zinc-400 flex items-center justify-between">
        <span className="hidden sm:inline">AURORA PULSE 2026 OFFICIAL TICKETING SYSTEM (MYSQL2 & NEXT.JS)</span>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <Link href="/orders" className="text-[#00f0ff] hover:underline font-bold">
            Riwayat Pesanan & E-Ticket QR →
          </Link>
          <span className="text-zinc-600">|</span>
          <Link href="/admin" className="text-[#ff2a6d] hover:underline font-bold">
            Portal Admin & Dashboard →
          </Link>
        </div>
      </div>

      {/* Main Landing Page Navbar */}
      <Navbar
        onOpenTickets={() => {
          const el = document.getElementById('tickets');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onReplayIntro={() => setShowIntro(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
      />

      <main>
        <HeroSection
          onOpenTickets={() => {
            const el = document.getElementById('tickets');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <LiveStatusBar />

        <LineupBento />

        <StageMapExplorer />

        <TicketPassSelector
          onCheckout={(tier, qty) => handleOpenCheckout(tier, qty)}
        />

        <ExperienceHighlights />

        <FestivalFaq />
      </main>

      <Footer />

      {/* Checkout and E-Ticket Modal Simulator with DB Integration */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tier={checkoutTier}
        quantity={checkoutQty}
      />
    </div>
  );
}
