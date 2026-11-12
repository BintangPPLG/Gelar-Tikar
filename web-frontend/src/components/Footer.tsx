import React from 'react';
import { InstagramLogo, YoutubeLogo, TwitterLogo, SpotifyLogo, ArrowUp } from '@phosphor-icons/react';
import { playClickBeep } from '../audio/synthAudio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    playClickBeep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#06070a] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#151822] border border-white/10 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-acid" />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-display">
                AURORA<span className="text-acid">PULSE</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
              Festival musik audio visual 360° spatial sound terbesar di Asia Tenggara yang menggabungkan inovasi teknologi panggung dengan musisi terbaik dunia di Jakarta.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {[
                { icon: InstagramLogo, href: '#', label: 'Instagram' },
                { icon: YoutubeLogo, href: '#', label: 'YouTube' },
                { icon: TwitterLogo, href: '#', label: 'Twitter' },
                { icon: SpotifyLogo, href: '#', label: 'Spotify' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    aria-label={item.label}
                    onClick={() => playClickBeep()}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 btn-tactile cursor-pointer"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-widest mb-4 font-bold">
              Navigasi Festival
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
              <li>
                <a href="#lineup" className="hover:text-white transition-colors">Lineup Artis & Jadwal</a>
              </li>
              <li>
                <a href="#venue" className="hover:text-white transition-colors">Peta Venue & Akses GBK</a>
              </li>
              <li>
                <a href="#tickets" className="hover:text-white transition-colors">Kategori & Harga Tiket</a>
              </li>
              <li>
                <a href="#experience" className="hover:text-white transition-colors">Fasilitas & Pengalaman</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Panduan & Syarat Ketentuan</a>
              </li>
            </ul>
          </div>

          {/* Venue & Organizer */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-widest mb-4 font-bold">
              Penyelenggara & Lokasi
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              <p>
                <strong className="text-white block mb-0.5 font-display text-sm">Stadion Madya Gelora Bung Karno</strong>
                Jl. Gerbang Pemuda No.3, Gelora, Tanah Abang, Jakarta Pusat 10270
              </p>
              <p className="text-xs text-zinc-500">
                Diselenggarakan oleh Sonic Live International & Nova Asia Entertainment. Hak Cipta Dilindungi.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            © 2026 AURORA PULSE FESTIVAL. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white btn-tactile cursor-pointer"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
