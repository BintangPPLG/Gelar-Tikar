import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { useRoute } from './lib/router';
import { SiteFooter, SiteNav } from './components/SiteNav';
import { EventPage } from './pages/EventPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderPage } from './pages/OrderPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';

/*
  Peta halaman (hash router):
  #/                     acara utama
  #/acara/:slug          acara di kota lain
  #/masuk, #/daftar      masuk / daftar (?next= halaman tujuan setelah masuk)
  #/pesan/:tierId?qty=   formulir pemesanan (wajib masuk)
  #/pesanan/:kode        status pembayaran dan e-tiket
  #/tiket-saya           semua pesanan milik akun
  #/admin/:tab           panel panitia (khusus admin)
*/
function Routes() {
  const { path, query } = useRoute();
  const [first, second] = path;

  let page: React.ReactNode;
  let nav = 'home';
  switch (first) {
    case 'acara':
      page = <EventPage slug={second} key={second} />;
      break;
    case 'masuk':
    case 'daftar':
      page = <AuthPage mode={first} next={query.get('next') || undefined} />;
      nav = 'auth';
      break;
    case 'pesan':
      page = <CheckoutPage tierId={Number(second)} initialQty={Number(query.get('qty')) || 1} key={second} />;
      break;
    case 'pesanan':
      page = <OrderPage code={second || ''} isNew={query.get('baru') === '1'} key={second} />;
      nav = 'tickets';
      break;
    case 'tiket-saya':
      page = <MyTicketsPage />;
      nav = 'tickets';
      break;
    case 'admin':
      page = <AdminPage tab={second} />;
      nav = 'admin';
      break;
    default:
      page = <EventPage key="home" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#utama" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-3 focus:py-2" onClick={(e) => {
        e.preventDefault();
        document.getElementById('utama')?.focus();
      }}>
        Langsung ke isi
      </a>
      <SiteNav current={nav} />
      <main id="utama" tabIndex={-1} className="flex-1 outline-none">
        {page}
      </main>
      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
