import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveStatusBar } from './components/LiveStatusBar';
import { LineupBento } from './components/LineupBento';
import { StageMapExplorer } from './components/StageMapExplorer';
import { TicketPassSelector } from './components/TicketPassSelector';
import { ExperienceHighlights } from './components/ExperienceHighlights';
import { FestivalFaq } from './components/FestivalFaq';
import { Footer } from './components/Footer';
import { WelcomeIntro } from './components/WelcomeIntro';
import { HomePage } from './components/home/HomePage';
import { AuthModal } from './components/auth/AuthModal';
import { AdminControlCenter } from './components/admin/AdminControlCenter';
import { MyTicketsModal } from './components/user/MyTicketsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { stopArtistAudioPreview } from './audio/synthAudio';
import { TicketTier, Event as EventType } from './api/client';

function MainAppContent() {
  const { isLoggedIn } = useAuth();

  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authRedirectMessage, setAuthRedirectMessage] = useState<string | null>(null);

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState<boolean>(false);

  const [checkoutTier, setCheckoutTier] = useState<TicketTier | null>(null);
  const [checkoutQty, setCheckoutQty] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const handleOpenAuth = (tab: 'login' | 'register' = 'login', msg: string | null = null) => {
    setAuthTab(tab);
    setAuthRedirectMessage(msg);
    setIsAuthOpen(true);
  };

  const handleOpenCheckout = (tier: any, event?: EventType, qty: number = 1) => {
    const formattedTier: TicketTier = {
      id: typeof tier.id === 'number' ? tier.id : 1,
      event_id: event?.id || tier.event_id || 1,
      name: tier.name,
      price: tier.price,
      total_quota: tier.total_quota || 1000,
      sold_count: tier.sold_count || 300,
      description: tier.description,
      status: 'active',
    };

    setCheckoutTier(formattedTier);
    setCheckoutQty(qty);

    if (!isLoggedIn) {
      handleOpenAuth('login', 'Silakan masuk atau daftar akun terlebih dahulu untuk melanjutkan pemesanan tiket konser.');
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleToggleAudio = () => {
    if (!isAudioMuted) {
      stopArtistAudioPreview();
    }
    setIsAudioMuted(!isAudioMuted);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-zinc-100 relative selection:bg-[#d4ff00] selection:text-black font-sans">
      {/* Welcome Intro Screen */}
      <AnimatePresence>
        {showIntro && (
          <WelcomeIntro onEnter={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Main Unified Responsive Navbar */}
      <Navbar
        onOpenTickets={() => {
          const el = document.getElementById('tickets');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAuth={(tab) => handleOpenAuth(tab || 'login')}
        onOpenMyTickets={() => setIsMyTicketsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* Dynamic Content View: Home (When Logged In) vs Landing (When Not Logged In) */}
      <main className="transition-all duration-300">
        {isLoggedIn ? (
          <HomePage
            onCheckout={(tier, event, qty) => handleOpenCheckout(tier, event, qty)}
            onOpenMyTickets={() => setIsMyTicketsOpen(true)}
          />
        ) : (
          <div className="space-y-0">
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
              onCheckout={(tier, qty) => handleOpenCheckout(tier, undefined, qty)}
            />

            <ExperienceHighlights />

            <FestivalFaq />
          </div>
        )}
      </main>

      <Footer />

      {/* 1. Unified Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
        redirectMessage={authRedirectMessage}
      />

      {/* 2. Unified Admin Control Center (Embedded Dashboard) */}
      <AdminControlCenter
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 3. My Tickets & QR E-Ticket Modal */}
      <MyTicketsModal
        isOpen={isMyTicketsOpen}
        onClose={() => setIsMyTicketsOpen(false)}
      />

      {/* 4. Checkout Modal (Stores order directly into DB) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tier={checkoutTier}
        quantity={checkoutQty}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
