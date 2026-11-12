import React, { useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { href } from '../lib/router';
import { cx } from './ui';

export function SiteNav({ current }: { current: string }) {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links: { to: string; label: string; key: string }[] = [
    { to: '/', label: 'Acara', key: 'home' },
    ...(isLoggedIn && !isAdmin ? [{ to: '/tiket-saya', label: 'Tiket saya', key: 'tickets' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Panel panitia', key: 'admin' }] : []),
  ];

  return (
    <header className="on-felt relative z-20 text-chalk">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6">
        <a href={href('/')} className="board b-sm no-underline" aria-label="Gelar Tikar, ke beranda">
          Gelar&nbsp;Tikar
        </a>

        <nav className="hidden items-center gap-7 text-[0.9375rem] md:flex" aria-label="Utama">
          {links.map((l) => (
            <a
              key={l.key}
              href={href(l.to)}
              aria-current={current === l.key ? 'page' : undefined}
              className={cx('no-underline hover:text-chalk', current === l.key ? 'text-chalk underline decoration-chalk/60' : 'text-chalk-dim')}
            >
              {l.label}
            </a>
          ))}
          {isLoggedIn ? (
            <span className="flex items-center gap-4 border-l border-felt-line pl-6">
              <span className="text-chalk-dim">{user?.name?.split(' ')[0]}</span>
              <button onClick={logout} className="text-chalk-dim underline decoration-chalk/40 hover:text-chalk">
                Keluar
              </button>
            </span>
          ) : (
            <a href={href('/masuk')} className="btn btn-chalk btn-sm no-underline">
              Masuk
            </a>
          )}
        </nav>

        <button className="md:hidden -mr-2 p-2" aria-expanded={open} aria-controls="menu-hp" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={24} /> : <List size={24} />}
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {open && (
        <nav id="menu-hp" className="border-y border-felt-line bg-felt-deep px-4 py-3 md:hidden" aria-label="Utama">
          {links.map((l) => (
            <a key={l.key} href={href(l.to)} onClick={() => setOpen(false)} className="block py-3 text-chalk no-underline">
              {l.label}
            </a>
          ))}
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="block w-full py-3 text-left text-chalk-dim"
            >
              Keluar ({user?.name?.split(' ')[0]})
            </button>
          ) : (
            <a href={href('/masuk')} onClick={() => setOpen(false)} className="block py-3 text-chalk no-underline">
              Masuk / daftar
            </a>
          )}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-felt mt-24 border-t border-felt-line text-chalk-dim">
      <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-10 text-[0.875rem] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="board text-chalk">Gelar Tikar</span> · festival band dan indie lokal
        </p>
        <p>Acara, band, dan harga di situs ini fiktif, dibuat untuk tugas sekolah.</p>
      </div>
    </footer>
  );
}
