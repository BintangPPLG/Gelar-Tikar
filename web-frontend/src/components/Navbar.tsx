import React, { useState, useEffect } from 'react';
import { 
  SpeakerHigh, 
  SpeakerSlash, 
  Ticket, 
  List, 
  X, 
  PlayCircle, 
  User as UserIcon, 
  ShieldCheck, 
  SignOut
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { playClickBeep } from '../audio/synthAudio';

interface NavbarProps {
  onOpenTickets: () => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onOpenMyTickets: () => void;
  onOpenAdmin: () => void;
  onReplayIntro: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTickets,
  onOpenAuth,
  onOpenMyTickets,
  onOpenAdmin,
  onReplayIntro,
  isAudioMuted,
  onToggleAudio,
}) => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const landingNavLinks = [
    { label: 'Lineup', href: '#lineup' },
    { label: 'Peta Venue', href: '#venue' },
    { label: 'Tiket & Pass', href: '#tickets' },
    { label: 'Pengalaman', href: '#experience' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = () => {
    playClickBeep();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 pb-2 pointer-events-none transition-all duration-300">
      {/* Floating Capsule Dock */}
      <div
        className={`max-w-7xl mx-auto rounded-2xl pointer-events-auto transition-all duration-300 ${
          scrolled
            ? 'bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 px-4 sm:px-6 py-3'
            : 'bg-[#0e1017]/60 backdrop-blur-md border border-white/5 px-4 sm:px-6 py-3.5'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={() => playClickBeep()}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none text-left select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#151822] border border-white/10 flex items-center justify-center group-hover:border-acid/40 transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-acid shadow-sm shadow-acid/40 group-hover:scale-125 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-white font-display leading-none">
                    AURORA<span className="text-acid">PULSE</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                    2026
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider mt-0.5">
                  STADION MADYA GBK
                </span>
              </div>
            </a>
          </div>

          {/* Center Navigation Links (Editorial Minimalist) */}
          {!isLoggedIn && (
            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1.5">
              {landingNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="px-3.5 py-1 text-xs font-semibold text-zinc-400 hover:text-white rounded-full hover:bg-white/[0.06] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right Controls & Auth */}
          <div className="hidden md:flex items-center gap-2">
            {/* Audio Ambient Controller */}
            <button
              onClick={() => {
                playClickBeep();
                onToggleAudio();
              }}
              title={isAudioMuted ? 'Aktifkan Audio Ambient' : 'Matikan Audio Ambient'}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 btn-tactile cursor-pointer"
            >
              {isAudioMuted ? <SpeakerSlash size={16} /> : <SpeakerHigh size={16} className="text-acid" />}
            </button>

            {/* Replay Intro */}
            <button
              onClick={() => {
                playClickBeep();
                onReplayIntro();
              }}
              title="Tonton Intro Sonic"
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 btn-tactile cursor-pointer"
            >
              <PlayCircle size={16} />
            </button>

            {/* User Session Bar */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                {isAdmin ? (
                  <button
                    onClick={() => {
                      playClickBeep();
                      onOpenAdmin();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cobalt/15 hover:bg-cobalt/25 border border-cobalt/40 text-cobalt text-xs font-bold font-mono btn-tactile cursor-pointer"
                  >
                    <ShieldCheck size={16} weight="fill" />
                    <span>Panel Admin</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-zinc-300 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 truncate max-w-[140px]">
                    {user?.name.split(' ')[0]}
                  </span>
                )}

                <button
                  onClick={() => {
                    playClickBeep();
                    onOpenMyTickets();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-acid text-black font-bold text-xs btn-tactile shadow-sm shadow-acid/20 cursor-pointer"
                >
                  <Ticket size={15} weight="fill" />
                  <span>Tiket Saya</span>
                </button>

                <button
                  onClick={() => {
                    playClickBeep();
                    logout();
                  }}
                  title="Keluar Akun"
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose hover:bg-white/[0.04] btn-tactile cursor-pointer"
                >
                  <SignOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <button
                  onClick={() => {
                    playClickBeep();
                    onOpenAuth('login');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.05] btn-tactile cursor-pointer"
                >
                  <UserIcon size={14} weight="bold" />
                  <span>Masuk</span>
                </button>

                <button
                  onClick={() => {
                    playClickBeep();
                    onOpenAuth('register');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-acid text-black font-bold text-xs btn-tactile shadow-md shadow-acid/15 hover:brightness-105 cursor-pointer"
                >
                  <span>Daftar Akun</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions Button */}
          <div className="flex md:hidden items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={() => {
                  playClickBeep();
                  onOpenMyTickets();
                }}
                className="p-2 rounded-xl bg-acid text-black btn-tactile"
              >
                <Ticket size={18} weight="fill" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white btn-tactile"
            >
              {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto bg-[#0e1017]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl pointer-events-auto">
          {isLoggedIn ? (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{user?.name}</div>
                  <div className="text-xs font-mono text-zinc-400">{user?.email}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose hover:underline font-mono"
                >
                  Keluar
                </button>
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-cobalt text-white font-bold text-xs flex items-center justify-center gap-1.5 btn-tactile"
                >
                  <ShieldCheck size={16} />
                  <span>Buka Panel Kontrol Admin</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenMyTickets();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-acid text-black font-bold text-xs flex items-center justify-center gap-1.5 btn-tactile"
              >
                <Ticket size={16} />
                <span>Lihat E-Ticket & QR Code</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-bold text-xs btn-tactile"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl bg-acid text-black font-bold text-xs btn-tactile"
                >
                  Daftar Akun
                </button>
              </div>

              <nav className="flex flex-col space-y-1 pt-2 border-t border-white/5">
                {landingNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className="px-3.5 py-2.5 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/[0.04] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </>
          )}
        </div>
      )}
    </header>
  );
};
