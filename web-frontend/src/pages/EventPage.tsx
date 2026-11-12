import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus } from '@phosphor-icons/react';
import { api, Event, TicketTier } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { go, href } from '../lib/router';
import { cityOf, dateRange, dayDate, dayLabel, rupiah, shortDate, MAX_PER_ORDER, SERVICE_FEE } from '../lib/format';
import { BoardText, ErrorNote, Loading, Paper, QuotaMeter, SectionTitle, Tear, cx } from '../components/ui';


const STAGES: Record<string, string> = { A: 'Teras', B: 'Pendopo', C: 'Serambi' };
const stageCode = (s: string) => s.trim().charAt(0).toUpperCase();

export function EventPage({ slug }: { slug?: string }) {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.events
      .getAll()
      .then((r) => setEvents(r.data))
      .catch((e) => setError(e.message || 'Gagal memuat acara.'));
  }, []);

  const event = useMemo(() => {
    if (!events?.length) return null;
    if (slug) return events.find((e) => e.slug === slug) || null;
    return events.find((e) => e.status === 'open') || events[0];
  }, [events, slug]);

  if (error)
    return (
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6">
        <Paper className="max-w-xl p-6">
          <ErrorNote>{error} Pastikan server backend berjalan di port 5000.</ErrorNote>
        </Paper>
      </div>
    );
  if (!events) return <Loading onFelt label="Memasang huruf di papan…" />;
  if (!event)
    return (
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6">
        <Paper className="max-w-xl p-6">
          <p>Acara ini tidak ditemukan.</p>
          <a className="link mt-3 inline-block" href={href('/')}>
            Kembali ke acara utama
          </a>
        </Paper>
      </div>
    );

  const others = events.filter((e) => e.id !== event.id);
  return (
    <>
      <EventBoard event={event} />
      <TicketList event={event} />
      <HowAndRules />
      {others.length > 0 && <OtherCities events={others} />}
    </>
  );
}

/* ---------------- Papan utama (layar pertama) ---------------- */
function EventBoard({ event }: { event: Event }) {
  const lineup = event.lineup || [];
  const days = Math.max(1, ...lineup.map((l) => l.day_number));
  const [day, setDay] = useState(1);
  useEffect(() => setDay(1), [event.id]);

  const tiers = event.ticket_tiers || [];
  const onSale = tiers.filter((t) => t.status === 'active' && t.total_quota > t.sold_count);
  const minPrice = onSale.length ? Math.min(...onSale.map((t) => t.price)) : null;
  const left = tiers.reduce((s, t) => s + Math.max(0, t.total_quota - t.sold_count), 0);
  const total = tiers.reduce((s, t) => s + t.total_quota, 0);
  const isOpen = event.status === 'open';

  const rows = lineup.filter((l) => l.day_number === day);
  const city = cityOf(event.title);
  const year = new Date(event.event_date).getFullYear();
  const stagesUsed = Array.from(new Set(lineup.map((l) => stageCode(l.stage_name)))).sort();

  const scrollToTickets = () => document.getElementById('tiket')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section className="mx-auto max-w-page px-3 sm:px-6" aria-labelledby="judul-acara">
      <div className="frame bg-felt">
        <div className="grid gap-10 px-5 pb-10 pt-8 sm:px-10 sm:pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-12">
          {/* Kiri: nama, tanggal, tempat */}
          <div className="order-1 flex flex-col justify-between gap-8 lg:col-span-7 lg:row-span-2">
            <h1 id="judul-acara" aria-label={`Gelar Tikar ${year} ${city}`}>
              <BoardText text="Gelar" className="b-xl block" />
              <BoardText text="Tikar" className="b-xl block" offset={5} />
              <BoardText text={String(year)} className="b-xl block" offset={10} />
            </h1>
            <div>
              <BoardText text={`${city} · ${dateRange(event.event_date, event.end_date)}`} as="p" className="b-md block" offset={18} />
              <BoardText text={event.venue_name} as="p" className="b-md block text-chalk-dim" offset={44} />
              <p className="mt-5 max-w-[46ch] text-chalk-dim">{event.description}</p>
            </div>

          </div>

          {/* Kanan: jadwal per hari */}
          <div className="order-3 lg:order-2 lg:col-span-5 lg:border-l lg:border-felt-line lg:pl-8">
            <div className="flex items-baseline justify-between">
              <BoardText text="Jadwal" as="h2" className="b-md" animate={false} />
              <span className="text-[0.8125rem] text-chalk-dim">{lineup.length} penampil</span>
            </div>

            {days > 1 && (
              <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Pilih hari">
                {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
                  <button
                    key={d}
                    role="tab"
                    aria-selected={day === d}
                    onClick={() => setDay(d)}
                    className={cx(
                      'board b-xs on-felt border px-3 transition-colors',
                      day === d ? 'border-chalk bg-chalk text-felt' : 'border-felt-line text-chalk-dim hover:border-chalk-dim hover:text-chalk'
                    )}
                    style={day === d ? { textShadow: 'none' } : undefined}
                  >
                    {dayLabel(dayDate(event.event_date, d))}
                  </button>
                ))}
              </div>
            )}

            <ol className="mt-5" key={`${event.id}-${day}`}>
              {rows.length === 0 && <li className="text-chalk-dim">Lineup belum diumumkan.</li>}
              {rows.map((r, i) => (
                <li key={r.id} className="grid grid-cols-[3.6rem_1.9rem_1fr] items-start gap-x-2 border-b border-felt-line py-[11px] last:border-b-0">
                  <BoardText text={r.performance_time.replace(':', '.')} className="b-sm text-chalk-dim" offset={i * 12} />
                  <span
                    className="board b-xs mt-[2px] grid h-6 w-6 place-items-center border border-chalk-dim/60 text-chalk-dim"
                    title={`Panggung ${STAGES[stageCode(r.stage_name)] || r.stage_name}`}
                  >
                    {stageCode(r.stage_name)}
                  </span>
                  <div>
                    <BoardText text={r.artist_name || ''} className="b-md block" offset={i * 12 + 4} />
                    <span className="block text-[0.8125rem] leading-5 text-chalk-dim">{r.genre}</span>
                  </div>
                </li>
              ))}
            </ol>

            {stagesUsed.length > 1 && (
              <p className="mt-5 text-[0.8125rem] text-chalk-dim">
                Panggung: {stagesUsed.map((c) => `${c} ${STAGES[c] || ''}`).join(' · ')}
              </p>
            )}

          </div>
          <Paper pin pinAt="78%" tilt={1.2} className="order-2 self-start px-6 pb-6 pt-7 sm:max-w-[24rem] lg:order-3 lg:col-span-5 lg:col-start-8 lg:ml-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[0.9375rem] text-ink-soft">Tiket mulai</p>
              <p className="text-[0.8125rem] text-ink-soft tnum">
                {left > 0 ? `Sisa ${left.toLocaleString('id-ID')} dari ${total.toLocaleString('id-ID')}` : 'Kuota habis'}
              </p>
            </div>
            <p className="mt-1 font-board text-[2.25rem] font-medium leading-none tracking-[0.01em] text-ink tnum">
              {minPrice !== null ? rupiah(minPrice) : '—'}
            </p>
            <Tear className="-mx-6 my-5" />
            {isOpen && minPrice !== null ? (
              <button className="btn btn-stamp w-full" onClick={scrollToTickets}>
                Pilih tiket
              </button>
            ) : (
              <p className="text-[0.9375rem] text-ink-soft">Penjualan tiket untuk acara ini sedang ditutup.</p>
            )}
            <p className="mt-3 text-[0.8125rem] text-ink-soft">Bayar lewat QRIS atau Virtual Account. Pembayaran diperiksa panitia.</p>
          </Paper>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Daftar harga ---------------- */
function TicketList({ event }: { event: Event }) {
  const tiers = event.ticket_tiers || [];
  const maxQuota = Math.max(1, ...tiers.map((t) => t.total_quota));
  return (
    <section className="mx-auto mt-20 max-w-page px-4 sm:px-6" aria-labelledby="tiket">
      <div className="mb-6">
        <BoardText as="h2" text="Harga tiket" className="b-lg" animate={false} />
        <p className="mt-1 max-w-[60ch] text-chalk-dim" id="tiket" style={{ scrollMarginTop: '7rem' }}>
          Harga sudah termasuk pajak. Ada biaya layanan {rupiah(SERVICE_FEE)} per pesanan. Maksimal {MAX_PER_ORDER} tiket per pesanan.
        </p>
      </div>
      <Paper pin pinAt="8%" className="px-5 py-2 sm:px-8">
        <span className="pin" style={{ left: 'calc(92% - 7px)' }} aria-hidden="true" />
        {tiers.length === 0 && <p className="py-6 text-ink-soft">Kategori tiket belum tersedia.</p>}
        <ul>
          {tiers.map((t) => (
            <TierRow key={t.id} tier={t} event={event} maxQuota={maxQuota} />
          ))}
        </ul>
      </Paper>
    </section>
  );
}

function TierRow({ tier, event, maxQuota }: { tier: TicketTier; event: Event; maxQuota: number }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const left = Math.max(0, tier.total_quota - tier.sold_count);
  const [qty, setQty] = useState(1);
  const maxQty = Math.min(MAX_PER_ORDER, left);
  const canBuy = event.status === 'open' && tier.status === 'active' && left > 0;
  const perks = Array.isArray(tier.perks_json) ? tier.perks_json : [];

  const order = () => {
    const target = `/pesan/${tier.id}?qty=${qty}`;
    if (!isLoggedIn) go(`/masuk?next=${encodeURIComponent(target)}`);
    else go(target);
  };

  const reason =
    event.status !== 'open' ? 'Penjualan ditutup' : tier.status === 'sold_out' || left === 0 ? 'Habis terjual' : tier.status === 'closed' ? 'Tidak dijual' : '';

  return (
    <li className="grid gap-x-8 gap-y-4 border-b rule py-6 last:border-b-0 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto]">
      <div>
        <h3 className="font-board text-[1.375rem] font-medium leading-tight tracking-[0.01em]">{tier.name}</h3>
        {tier.description && <p className="mt-1 text-ink-soft">{tier.description}</p>}
        {perks.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.875rem] text-ink-soft">
            {perks.map((p) => (
              <li key={p} className="before:mr-2 before:text-ink-faint before:content-['–']">
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="md:pt-2">
        <p className="font-board text-[1.5rem] leading-none tnum">{rupiah(tier.price)}</p>
        <div className="mt-3">
          <QuotaMeter sold={tier.sold_count} quota={tier.total_quota} maxQuota={maxQuota} />
        </div>
      </div>

      <div className="flex items-start gap-3 md:justify-end md:pt-1">
        {canBuy && !isAdmin ? (
          <>
            <div className="flex h-11 items-center border border-[#c9c1ab]" role="group" aria-label={`Jumlah tiket ${tier.name}`}>
              <button className="grid h-full w-10 place-items-center disabled:opacity-40" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Kurangi">
                <Minus size={16} />
              </button>
              <output className="w-8 text-center tnum" aria-live="polite">
                {qty}
              </output>
              <button className="grid h-full w-10 place-items-center disabled:opacity-40" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Tambah">
                <Plus size={16} />
              </button>
            </div>
            <button className="btn btn-stamp" onClick={order}>
              Pesan
            </button>
          </>
        ) : canBuy && isAdmin ? (
          <span className="text-[0.875rem] text-ink-soft">Akun panitia tidak bisa memesan</span>
        ) : (
          <span className="stamp text-ink-soft">{reason}</span>
        )}
      </div>
    </li>
  );
}

/* ---------------- Cara beli & aturan ---------------- */
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Bagaimana tiket ditukar di lokasi?',
    a: 'Tunjukkan kode QR dari halaman Tiket saya di gerbang, lalu tukar dengan gelang kain. Satu kode QR berlaku untuk semua tiket dalam pesanan itu, jadi datanglah bersama.',
  },
  {
    q: 'Sudah bayar, tapi status masih menunggu?',
    a: 'Panitia memeriksa setiap pembayaran paling lambat 1×24 jam. Bila pembayaran ditolak, kuota tiket dikembalikan dan kamu bisa memesan lagi.',
  },
  { q: 'Boleh membawa tikar sendiri?', a: 'Boleh, ukuran paling besar 2×2 meter. Area duduk ada di belakang garis kuning di setiap panggung.' },
  { q: 'Ada batas usia?', a: 'Pengunjung di bawah 15 tahun wajib didampingi orang dewasa.' },
  { q: 'Bisa refund?', a: 'Tiket yang sudah lunas tidak bisa dikembalikan, kecuali acara dibatalkan oleh panitia.' },
  { q: 'Barang apa yang dilarang?', a: 'Senjata tajam, minuman beralkohol, obat-obatan terlarang, dan kamera berlensa lepas.' },
];

function HowAndRules() {
  return (
    <section className="mx-auto mt-24 grid max-w-page gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <SectionTitle sub="Dari memesan sampai masuk gerbang.">Cara beli</SectionTitle>
        <Paper pin pinAt="50%" tilt={0.8} warm className="px-6 pb-6 pt-8">
          <ol className="space-y-4">
            {[
              ['Masuk atau daftar', 'Pesanan tercatat di akunmu, jadi tiket tidak hilang.'],
              ['Pilih kategori dan jumlah', `Paling banyak ${MAX_PER_ORDER} tiket dalam satu pesanan.`],
              ['Bayar sesuai nominal', 'Lewat QRIS atau nomor Virtual Account yang muncul setelah memesan.'],
              ['Panitia memeriksa pembayaran', 'Status berubah dari "menunggu" menjadi "lunas" atau "ditolak".'],
              ['Tunjukkan QR di gerbang', 'E-tiket muncul di halaman Tiket saya setelah lunas.'],
            ].map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[1.75rem_1fr] gap-2">
                <span className="font-board text-[1.125rem] text-ink-faint tnum">{i + 1}</span>
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="text-[0.9375rem] text-ink-soft">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Paper>
      </div>

      <div className="lg:col-span-7">
        <SectionTitle sub="Yang paling sering ditanyakan ke panitia.">Sebelum datang</SectionTitle>
        <Paper pin pinAt="30%" tilt={-0.5} className="px-6 pb-2 pt-6">
          {FAQ.map((f, i) => (
            <details key={f.q} className="group border-b rule py-4 last:border-b-0" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus size={18} className="mt-1 shrink-0 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-2 max-w-[62ch] text-ink-soft">{f.a}</p>
            </details>
          ))}
        </Paper>
      </div>
    </section>
  );
}

/* ---------------- Kota lain ---------------- */
function OtherCities({ events }: { events: Event[] }) {
  return (
    <section className="mx-auto mt-24 max-w-page px-4 sm:px-6">
      <SectionTitle sub="Setiap kota punya lineup dan harga sendiri.">Juga di kota lain</SectionTitle>
      <ul className="border-t border-felt-line">
        {events.map((e) => {
          const tiers = e.ticket_tiers || [];
          const sale = tiers.filter((t) => t.status === 'active' && t.total_quota > t.sold_count);
          const min = sale.length ? Math.min(...sale.map((t) => t.price)) : null;
          return (
            <li key={e.id} className="border-b border-felt-line">
              <a
                href={href(`/acara/${e.slug}`)}
                className="on-felt group grid gap-x-6 gap-y-1 py-5 no-underline sm:grid-cols-[13rem_1fr_auto] sm:items-baseline"
              >
                <BoardText text={cityOf(e.title)} className="b-md" animate={false} />
                <span className="text-chalk-dim">
                  {shortDate(e.event_date)}
                  {e.end_date && shortDate(e.end_date) !== shortDate(e.event_date) ? `–${shortDate(e.end_date)}` : ''} · {e.venue_name}
                  {(e.lineup || []).length > 0 && ` · ${(e.lineup || []).map((l) => l.artist_name).slice(0, 3).join(', ')}`}
                </span>
                <span className="flex items-center gap-2 text-chalk">
                  {e.status !== 'open' ? 'Penjualan ditutup' : min !== null ? `mulai ${rupiah(min)}` : 'Habis'}
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
