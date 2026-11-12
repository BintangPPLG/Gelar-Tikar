import React, { useEffect, useState } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { api, Order } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { go, href } from '../lib/router';
import { cityOf, dateTime, longDate, rupiah } from '../lib/format';
import { BoardText, ErrorNote, Loading, Paper, StatusStamp } from '../components/ui';

export function MyTicketsPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isLoggedIn) go(`/masuk?next=${encodeURIComponent('/tiket-saya')}`);
  }, [isLoading, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    api.orders
      .getMyOrders()
      .then((r) => setOrders(r.data))
      .catch((e) => setError(e.message));
  }, [isLoggedIn]);

  const active = orders?.filter((o) => o.status === 'paid') || [];
  const waiting = orders?.filter((o) => o.status === 'pending') || [];
  const past = orders?.filter((o) => o.status === 'rejected' || o.status === 'cancelled') || [];

  return (
    <div className="mx-auto max-w-page px-4 pt-6 sm:px-6">
      <BoardText as="h1" text="Tiket saya" className="b-lg block" />
      <p className="mt-1 text-chalk-dim">Semua pesanan atas akun {user?.email}.</p>

      {error && (
        <Paper className="mt-6 max-w-xl p-6">
          <ErrorNote>{error}</ErrorNote>
        </Paper>
      )}
      {!orders && !error && <Loading onFelt />}

      {orders && orders.length === 0 && (
        <Paper pin className="mt-8 max-w-xl px-6 pb-6 pt-8">
          <p className="font-medium">Belum ada pesanan.</p>
          <p className="mt-1 text-ink-soft">Pilih acara dan kategori tiket, lalu pesananmu akan muncul di sini.</p>
          <a href={href('/')} className="btn btn-stamp mt-5 no-underline">
            Lihat acara
          </a>
        </Paper>
      )}

      {orders && orders.length > 0 && (
        <div className="mt-8 space-y-10">
          <Group title="Menunggu pembayaran diverifikasi" orders={waiting} note="Selesaikan pembayaran, lalu tunggu panitia memeriksa." />
          <Group title="Tiket aktif" orders={active} note="Buka pesanan untuk menampilkan kode QR di gerbang." />
          <Group title="Ditolak" orders={past} note="Kuota tiket dari pesanan ini sudah dikembalikan." />
        </div>
      )}
    </div>
  );
}

function Group({ title, orders, note }: { title: string; orders: Order[]; note: string }) {
  if (!orders.length) return null;
  return (
    <section>
      <h2 className="text-chalk">
        <span className="board b-sm">{title}</span> <span className="text-chalk-dim">· {orders.length}</span>
      </h2>
      <p className="text-[0.875rem] text-chalk-dim">{note}</p>
      <Paper className="mt-4 px-5 sm:px-6">
        <ul>
          {orders.map((o) => {
            const item = o.items?.[0];
            const qty = o.items?.reduce((s, i) => s + i.quantity, 0) || 0;
            return (
              <li key={o.id} className="border-b rule last:border-b-0">
                <a
                  href={href(`/pesanan/${o.order_code}`)}
                  className="group grid gap-x-6 gap-y-2 py-5 text-ink no-underline sm:grid-cols-[1.4fr_1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="font-board text-[1.25rem] font-medium leading-tight">{cityOf(o.event_title || '')}</p>
                    <p className="text-[0.875rem] text-ink-soft">
                      {item?.tier_name} × {qty} · {item?.valid_for ? `berlaku ${item.valid_for}` : longDate(o.event_date)}
                    </p>
                  </div>
                  <p className="text-[0.875rem] text-ink-soft">
                    <span className="font-board tracking-[0.04em] text-ink">{o.order_code}</span>
                    <br />
                    dipesan {dateTime(o.created_at)}
                  </p>
                  <p className="font-board text-[1.125rem] tnum">{rupiah(o.total_amount)}</p>
                  <span className="flex items-center gap-3">
                    <StatusStamp status={o.status} />
                    <ArrowRight size={18} className="text-ink-soft transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </Paper>
    </section>
  );
}
