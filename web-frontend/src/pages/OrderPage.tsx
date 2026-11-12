import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ArrowLeft, Check, Copy } from '@phosphor-icons/react';
import { api, Order } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { go, href } from '../lib/router';
import { cityOf, dateTime, gateFor, longDate, paymentLabel, rupiah } from '../lib/format';
import { BoardText, ErrorNote, Loading, Paper, StatusStamp, Tear, cx } from '../components/ui';

export function OrderPage({ code, isNew }: { code: string; isNew: boolean }) {
  const { isLoggedIn, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isLoggedIn) go(`/masuk?next=${encodeURIComponent(`/pesanan/${code}`)}`);
  }, [isLoading, isLoggedIn, code]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let alive = true;
    const load = () =>
      api.orders
        .getByCode(code)
        .then((r) => alive && setOrder(r.data))
        .catch((e) => alive && setError(e.message));
    load();
    // Selama menunggu verifikasi, status dicek ulang tiap 10 detik.
    const t = setInterval(() => {
      if (order?.status === 'pending' || !order) load();
    }, 10000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [code, isLoggedIn, order?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error)
    return (
      <Wrap>
        <Paper className="max-w-xl p-6">
          <ErrorNote>{error}</ErrorNote>
          <a href={href('/tiket-saya')} className="link mt-4 inline-block">
            Ke Tiket saya
          </a>
        </Paper>
      </Wrap>
    );
  if (!order) return <Loading onFelt />;

  const item = order.items?.[0];
  const qty = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <Wrap>
      <a href={href('/tiket-saya')} className="on-felt inline-flex items-center gap-2 text-chalk-dim no-underline hover:text-chalk">
        <ArrowLeft size={18} /> Semua tiket saya
      </a>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <BoardText as="h1" text={`Pesanan ${order.order_code}`} className="b-lg" />
        <span className="text-chalk-dim">dibuat {dateTime(order.created_at)}</span>
      </div>
      {isNew && order.status === 'pending' && (
        <p className="mt-2 max-w-[60ch] text-chalk" role="status">
          Pesanan sudah dibuat dan kuota disimpan. Selesaikan pembayaran di bawah ini.
        </p>
      )}

      <StatusTrack status={order.status} />

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {order.status === 'pending' && <PaymentInstructions order={order} />}
          {order.status === 'paid' && <ETicket order={order} />}
          {order.status === 'rejected' && (
            <Paper pin pinAt="15%" className="px-6 pb-6 pt-8">
              <StatusStamp status="rejected" />
              <h2 className="mt-3 font-board text-[1.375rem] font-medium">Pembayaran tidak dapat diverifikasi</h2>
              <p className="mt-2 max-w-[58ch] text-ink-soft">
                Panitia tidak menemukan pembayaran yang cocok untuk pesanan ini. Kuota {qty} tiket sudah dikembalikan. Kamu bisa memesan lagi selama kuota masih ada.
              </p>
              <a href={href('/')} className="btn btn-ink mt-5 no-underline">
                Pesan lagi
              </a>
            </Paper>
          )}
          {order.status === 'cancelled' && (
            <Paper className="p-6">
              <p>Pesanan ini dibatalkan.</p>
            </Paper>
          )}
        </div>

        <div className="lg:col-span-5">
          <Paper warm pin pinAt="80%" tilt={0.6} className="px-6 pb-6 pt-7">
            <h2 className="font-board text-[1.125rem] font-medium">Rincian pesanan</h2>
            <dl className="mt-4 space-y-3 text-[0.9375rem]">
              <Line k="Acara" v={order.event_title || '-'} />
              <Line k="Tempat" v={order.venue_name || '-'} />
              <Line k="Kategori" v={`${item?.tier_name || '-'} × ${qty}`} />
              <Line k="Pemegang" v={order.customer_name} />
              <Line k="Pembayaran" v={paymentLabel(order.payment?.payment_method)} />
              <div className="flex justify-between border-t rule pt-3">
                <dt className="text-ink-soft">Total</dt>
                <dd className="font-board text-[1.25rem] font-medium tnum">{rupiah(order.total_amount)}</dd>
              </div>
            </dl>
          </Paper>
        </div>
      </div>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-page px-4 pt-6 sm:px-6">{children}</div>;
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3">
      <dt className="text-ink-soft">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

/** Jalur status: Dipesan → Diverifikasi panitia → Tiket aktif (atau Ditolak). */
function StatusTrack({ status }: { status: Order['status'] }) {
  const rejected = status === 'rejected' || status === 'cancelled';
  const steps = [
    { label: 'Pesanan dibuat', done: true },
    { label: 'Pembayaran diperiksa panitia', done: status !== 'pending', current: status === 'pending' },
    rejected ? { label: 'Ditolak', done: true, bad: true } : { label: 'E-tiket aktif', done: status === 'paid' },
  ];
  return (
    <ol className="on-felt mt-6 grid max-w-3xl grid-cols-3 border-t border-felt-line" aria-label="Status pesanan">
      {steps.map((s, i) => (
        <li key={s.label} className="relative pr-3 pt-4">
          <span
            className={cx(
              'absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full',
              (s as any).bad ? 'bg-stamp' : s.done ? 'bg-chalk' : s.current ? 'bg-chalk-dim ring-4 ring-chalk/15' : 'bg-felt-line'
            )}
            aria-hidden="true"
          />
          <span className={cx('block text-[0.875rem] leading-5', s.done || s.current ? 'text-chalk' : 'text-chalk-dim')}>{s.label}</span>
          {s.current && <span className="block text-[0.8125rem] text-chalk-dim">sedang berlangsung</span>}
          {!s.current && <span className="sr-only">{s.done ? '(selesai)' : '(belum)'}</span>}
        </li>
      ))}
    </ol>
  );
}

function useQr(text: string, size = 220) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    QRCode.toDataURL(text, { width: size, margin: 1, color: { dark: '#1b1b18', light: '#f5f2ea' } }).then(setUrl).catch(() => setUrl(''));
  }, [text, size]);
  return url;
}

function PaymentInstructions({ order }: { order: Order }) {
  const p = order.payment;
  const qrisUrl = useQr(`QRIS-SIMULASI|GELARTIKAR|${order.order_code}|${order.total_amount}`, 200);
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text.replace(/\s/g, '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <Paper pin pinAt="15%" className="px-6 pb-7 pt-8 sm:px-8">
      <StatusStamp status="pending" />
      <h2 className="mt-3 font-board text-[1.375rem] font-medium">Bayar {rupiah(order.total_amount)}</h2>
      <p className="mt-1 text-ink-soft">Bayar tepat sesuai nominal supaya panitia mudah mencocokkan pembayaranmu.</p>

      {p?.payment_method === 'virtual_account' ? (
        <div className="mt-6">
          <p className="text-[0.875rem] text-ink-soft">Nomor Virtual Account (simulasi)</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <p className="font-board text-[1.75rem] tracking-[0.06em] tnum">{p.payment_reference}</p>
            <button className="btn btn-line btn-sm" onClick={() => copy(p.payment_reference || '')}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
          <ol className="mt-5 list-decimal space-y-1.5 pl-5 text-[0.9375rem] text-ink-soft">
            <li>Buka aplikasi bank, pilih Transfer lalu Virtual Account.</li>
            <li>Masukkan nomor di atas dan periksa nama penerima: Gelar Tikar.</li>
            <li>Bayar {rupiah(order.total_amount)}, lalu simpan bukti transfer.</li>
          </ol>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          {qrisUrl ? (
            <img src={qrisUrl} width={200} height={200} alt={`Kode QRIS simulasi untuk pesanan ${order.order_code}`} className="border border-paper-edge" />
          ) : (
            <div className="h-[200px] w-[200px] bg-paper-warm" />
          )}
          <div>
            <p className="text-[0.875rem] text-ink-soft">QRIS (simulasi)</p>
            <p className="font-medium">Gelar Tikar · {order.order_code}</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.9375rem] text-ink-soft">
              <li>Buka aplikasi bank atau dompet digital.</li>
              <li>Pindai kode QR ini.</li>
              <li>Pastikan nominal {rupiah(order.total_amount)}, lalu bayar.</li>
            </ol>
          </div>
        </div>
      )}

      <div className="mt-7 border-t rule pt-5 text-[0.9375rem] text-ink-soft">
        Setelah membayar, panitia memeriksa pembayaranmu paling lambat 1×24 jam. Halaman ini memperbarui statusnya sendiri. E-tiket muncul di sini begitu pembayaran
        disetujui.
      </div>
    </Paper>
  );
}

function ETicket({ order }: { order: Order }) {
  const item = order.items?.[0];
  const qty = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const qr = useQr(item?.ticket_code || order.order_code, 240);
  return (
    <Paper pin pinAt="50%">
      <div className="flex items-start justify-between gap-4 overflow-hidden bg-felt px-6 pb-5 pt-7 text-chalk">
        <div>
          <BoardText text={`Gelar Tikar ${cityOf(order.event_title || '')}`} className="b-lg block" />
        </div>
        <span className="stamp mt-2 border-chalk text-chalk">E-tiket</span>
      </div>
      <div className="grid gap-6 px-6 py-6 sm:grid-cols-[1fr_auto]">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[0.9375rem]">
          <div className="col-span-2">
            <dt className="text-[0.8125rem] text-ink-soft">Pemegang</dt>
            <dd className="font-medium">{order.customer_name}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-soft">Kategori</dt>
            <dd>{item?.tier_name}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-soft">Jumlah tiket</dt>
            <dd className="tnum">{qty}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-soft">Berlaku</dt>
            <dd>{item?.valid_for || longDate(order.event_date)}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-soft">Masuk lewat</dt>
            <dd>{gateFor(item?.tier_name)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[0.8125rem] text-ink-soft">Tempat</dt>
            <dd>{order.venue_name}</dd>
          </div>
        </dl>
        <div className="justify-self-center text-center">
          {qr && <img src={qr} width={160} height={160} alt={`Kode QR tiket ${item?.ticket_code}`} />}
          <p className="mt-1 font-board text-[0.875rem] tracking-[0.06em] tnum">{item?.ticket_code}</p>
        </div>
      </div>
      <Tear />
      <p className="px-6 pb-6 pt-4 text-[0.875rem] text-ink-soft">
        Tunjukkan kode QR ini di {gateFor(item?.tier_name)} dan tukar dengan {qty > 1 ? `${qty} gelang kain` : 'gelang kain'}. Bawa kartu identitas atas nama pemegang.
      </p>
    </Paper>
  );
}
