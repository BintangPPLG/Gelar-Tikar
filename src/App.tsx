import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { WelcomeIntro } from './components/WelcomeIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveStatusBar } from './components/LiveStatusBar';
import { LineupBento } from './components/LineupBento';
import { StageMapExplorer } from './components/StageMapExplorer';
import { TicketPassSelector } from './components/TicketPassSelector';
import type { TicketTier } from './components/TicketPassSelector';
import { ExperienceHighlights } from './components/ExperienceHighlights';
import { FestivalFaq } from './components/FestivalFaq';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { stopArtistAudioPreview } from './audio/synthAudio';

export const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(true);
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
      {/* Welcome Intro Animation Screen */}
      <AnimatePresence>
        {showIntro && (
          <WelcomeIntro onEnter={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Main Landing Page */}
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

      {/* Checkout and E-Ticket Modal Simulator */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tier={checkoutTier}
        quantity={checkoutQty}
      />
    </div>
  );
};

export default App;
