import React, { useState, useEffect } from 'react';
import { Sparkle, SpeakerHigh, SpeakerSlash, Ticket, List, X, PlayCircle } from '@phosphor-icons/react';
import { playClickBeep } from '../audio/synthAudio';

interface NavbarProps {
  onOpenTickets: () => void;
  onReplayIntro: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTickets,
  onReplayIntro,
  isAudioMuted,
  onToggleAudio
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Lineup Artis', href: '#lineup' },
    { label: 'Peta Venue', href: '#venue' },
    { label: 'Kategori Tiket', href: '#tickets' },
    { label: 'Pengalaman', href: '#experience' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = () => {
    playClickBeep();
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090d]/85 backdrop-blur-md border-b border-white/10 shadow-lg py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#"
          onClick={() => playClickBeep()}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f0ff] via-[#ff2a6d] to-[#ff9f1c] p-0.5 flex items-center justify-center shadow-md shadow-[#00f0ff]/20">
            <div className="w-full h-full bg-[#08090d] rounded-[7px] flex items-center justify-center">
              <Sparkle size={16} weight="fill" className="text-[#00f0ff] group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white font-display leading-none">
              AURORA<span className="text-[#00f0ff]">PULSE</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
              JAKARTA 2026
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="text-sm font-medium text-zinc-300 hover:text-[#00f0ff] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Audio toggle button */}
          <button
            onClick={() => {
              playClickBeep();
              onToggleAudio();
            }}
            title={isAudioMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
            className="p-2 rounded-full glass-pill text-zinc-300 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-all cursor-pointer"
          >
            {isAudioMuted ? <SpeakerSlash size={18} /> : <SpeakerHigh size={18} />}
          </button>

          {/* Replay intro */}
          <button
            onClick={() => {
              playClickBeep();
              onReplayIntro();
            }}
            title="Tonton Ulang Intro"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs font-mono text-zinc-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
          >
            <PlayCircle size={14} />
            <span>Intro</span>
          </button>

          {/* Primary CTA */}
          <a
            href="#tickets"
            onClick={() => {
              playClickBeep();
              onOpenTickets();
            }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#00f0ff] text-black font-bold text-xs tracking-wider uppercase hover:bg-[#38bdf8] transition-all duration-200 shadow-md shadow-[#00f0ff]/20 cursor-pointer"
          >
            <Ticket size={16} weight="fill" />
            <span>Pesan Tiket</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleAudio}
            className="p-2 rounded-lg glass-pill text-zinc-300"
          >
            {isAudioMuted ? <SpeakerSlash size={18} /> : <SpeakerHigh size={18} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg glass-pill text-zinc-200"
          >
            {mobileMenuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0c12]/95 backdrop-blur-xl border-b border-white/10 px-6 py-5 mt-2 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="text-base font-medium text-zinc-200 hover:text-[#00f0ff]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                playClickBeep();
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg glass-pill text-xs font-mono text-zinc-200"
            >
              <PlayCircle size={16} />
              <span>Tonton Intro Video</span>
            </button>
            <a
              href="#tickets"
              onClick={() => {
                playClickBeep();
                setMobileMenuOpen(false);
                onOpenTickets();
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00f0ff] text-black font-bold text-sm uppercase"
            >
              <Ticket size={18} weight="fill" />
              <span>Pesan Tiket Sekarang</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
