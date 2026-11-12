import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { api, Artist, DashboardMetrics, Event, Order, TicketTier } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { go, href } from '../lib/router';
import { cityOf, dateRange, dateTime, paymentLabel, rupiah } from '../lib/format';
import { BoardText, ErrorNote, Field, Loading, Paper, QuotaMeter, StatusStamp, cx } from '../components/ui';

const TABS = [
  { key: 'ringkasan', label: 'Ringkasan' },
  { key: 'pesanan', label: 'Pesanan' },
  { key: 'tiket', label: 'Kategori tiket' },
  { key: 'acara', label: 'Acara' },
  { key: 'artis', label: 'Band' },
] as const;
type Tab = (typeof TABS)[number]['key'];

export function AdminPage({ tab }: { tab?: string }) {
  const { isAdmin, isLoggedIn, isLoading } = useAuth();
  const current: Tab = (TABS.find((t) => t.key === tab)?.key || 'ringkasan') as Tab;
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) go(`/masuk?next=${encodeURIComponent('/admin')}`);
  }, [isLoading, isLoggedIn]);

  const refreshPending = useCallback(() => {
    api.admin
      .getDashboard()
      .then((r) => setPending(r.data.pendingOrdersCount))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (isAdmin) refreshPending();
  }, [isAdmin, refreshPending]);

  if (isLoading) return <Loading onFelt />;
  if (!isAdmin)
    return (
      <div className="mx-auto max-w-page px-4 pt-8 sm:px-6">
        <Paper className="max-w-xl p-6">
          <p className="font-medium">Halaman ini khusus panitia.</p>
          <p className="mt-1 text-ink-soft">Masuk dengan akun panitia untuk memverifikasi pembayaran dan mengelola acara.</p>
          <a href={href('/')} className="link mt-4 inline-block">
            Kembali ke acara
          </a>
        </Paper>
      </div>
    );

  return (
    <div className="mx-auto max-w-page px-4 pt-4 sm:px-6">
      <BoardText as="h1" text="Panel panitia" className="b-lg block" />
      <nav className="on-felt mt-4 flex gap-1 overflow-x-auto border-b border-felt-line" aria-label="Menu panitia">
        {TABS.map((t) => (
          <a
            key={t.key}
            href={href(`/admin/${t.key}`)}
            aria-current={current === t.key ? 'page' : undefined}
            className={cx(
              'shrink-0 border-b-2 px-3 pb-3 pt-1 text-[0.9375rem] no-underline',
              current === t.key ? 'border-chalk text-chalk' : 'border-transparent text-chalk-dim hover:text-chalk'
            )}
          >
            {t.label}
            {t.key === 'pesanan' && pending ? <span className="ml-2 rounded-sm bg-stamp px-1.5 text-[0.75rem] text-white tnum">{pending}</span> : null}
          </a>
        ))}
      </nav>

      <div className="mt-8">
        {current === 'ringkasan' && <Summary />}
        {current === 'pesanan' && <Orders onChange={refreshPending} />}
        {current === 'tiket' && <Tiers />}
        {current === 'acara' && <Events />}
        {current === 'artis' && <Artists />}
      </div>
    </div>
  );
}

/* ---------------- Ringkasan ---------------- */
function Summary() {
  const [m, setM] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.admin.getDashboard(), api.events.getAll()])
      .then(([d, e]) => {
        setM(d.data);
        setEvents(e.data);
      })
      .catch((e) => setError(e.message));
  }, []);
  if (error) return <ErrorBox msg={error} />;
  if (!m) return <Loading onFelt />;

  const ledger: [string, React.ReactNode, string?][] = [
    ['Pendapatan terverifikasi', rupiah(m.totalRevenue), 'Dari pesanan berstatus lunas.'],
    ['Menunggu verifikasi', <a href={href('/admin/pesanan')} className="link">{m.pendingOrdersCount} pesanan</a>, 'Periksa pembayaran lalu setujui atau tolak.'],
    ['Pesanan lunas', `${m.paidOrdersCount} pesanan`],
    ['Pesanan ditolak', `${m.rejectedOrdersCount} pesanan`, 'Kuotanya sudah dikembalikan.'],
    ['Tiket terjual dan dipesan', `${m.totalTicketsSold.toLocaleString('id-ID')} dari ${m.totalQuota.toLocaleString('id-ID')}`, 'Semua acara, termasuk penjualan sebelum web dibuka.'],
  ];
  const maxQuota = Math.max(1, ...events.map((e) => (e.ticket_tiers || []).reduce((s, t) => s + t.total_quota, 0)));

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <Paper pin pinAt="15%" className="px-6 pb-3 pt-7 lg:col-span-5">
        <h2 className="font-board text-[1.25rem] font-medium">Buku kas</h2>
        <dl className="mt-3">
          {ledger.map(([k, v, note]) => (
            <div key={k} className="border-b rule py-3 last:border-b-0">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-soft">{k}</dt>
                <dd className="text-right font-board text-[1.125rem] tnum">{v}</dd>
              </div>
              {note && <p className="text-[0.8125rem] text-ink-faint">{note}</p>}
            </div>
          ))}
        </dl>
      </Paper>

      <div className="lg:col-span-7">
        <Paper pin pinAt="85%" className="px-6 pb-3 pt-7">
          <h2 className="font-board text-[1.25rem] font-medium">Kuota per acara</h2>
          <ul className="mt-3">
            {events.map((e) => {
              const tiers = e.ticket_tiers || [];
              const q = tiers.reduce((s, t) => s + t.total_quota, 0);
              const s = tiers.reduce((x, t) => x + t.sold_count, 0);
              return (
                <li key={e.id} className="grid gap-x-6 gap-y-2 border-b rule py-4 last:border-b-0 sm:grid-cols-[9rem_1fr]">
                  <div>
                    <p className="font-medium">{cityOf(e.title)}</p>
                    <p className="text-[0.8125rem] text-ink-soft">{e.status === 'open' ? 'Penjualan dibuka' : 'Penjualan ditutup'}</p>
                  </div>
                  <QuotaMeter sold={s} quota={q} maxQuota={maxQuota} />
                </li>
              );
            })}
          </ul>
        </Paper>
        <p className="on-felt mt-4 text-[0.875rem] text-chalk-dim">
          {m.storage === 'mysql'
            ? 'Data tersimpan di database MySQL.'
            : 'MySQL tidak tersambung, jadi server memakai data contoh di memori. Perubahan akan kembali ke awal saat server dimatikan.'}
        </p>
      </div>
    </div>
  );
}

/* ---------------- Pesanan ---------------- */
const FILTERS: { key: Order['status'] | 'all'; label: string }[] = [
  { key: 'pending', label: 'Menunggu' },
  { key: 'paid', label: 'Lunas' },
  { key: 'rejected', label: 'Ditolak' },
  { key: 'all', label: 'Semua' },
];

function Orders({ onChange }: { onChange: () => void }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('pending');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    api.admin
      .getAllOrders()
      .then((r) => setOrders(r.data))
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (orders || [])
      .filter((o) => filter === 'all' || o.status === filter)
      .filter((o) => !term || [o.order_code, o.customer_name, o.customer_email].some((x) => x?.toLowerCase().includes(term)));
  }, [orders, filter, q]);

  const decide = async (o: Order, status: 'verified' | 'rejected') => {
    setError('');
    try {
      const r = await api.admin.verifyOrder(o.id, status);
      setMsg(`${o.order_code}: ${r.message}`);
      load();
      onChange();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const count = (k: string) => (orders || []).filter((o) => k === 'all' || o.status === k).length;

  return (
    <div>
      <div className="on-felt flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Saring status">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cx('btn btn-sm', filter === f.key ? 'bg-chalk text-felt' : 'btn-chalk')}
            >
              {f.label} <span className="tnum opacity-70">{count(f.key)}</span>
            </button>
          ))}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Cari pesanan</span>
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input className="field pl-9" placeholder="Kode, nama, atau email" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      {msg && (
        <p className="on-felt mt-4 text-chalk" role="status">
          {msg}
        </p>
      )}
      {error && <ErrorBox msg={error} />}
      {!orders && !error && <Loading onFelt />}

      {orders && (
        <Paper className="mt-5 px-5 sm:px-6">
          {list.length === 0 ? (
            <p className="py-8 text-ink-soft">{filter === 'pending' ? 'Tidak ada pembayaran yang menunggu. Semua sudah diperiksa.' : 'Tidak ada pesanan untuk saringan ini.'}</p>
          ) : (
            <ul>
              {list.map((o) => (
                <OrderRow key={o.id} order={o} onDecide={decide} />
              ))}
            </ul>
          )}
        </Paper>
      )}
    </div>
  );
}

function OrderRow({ order: o, onDecide }: { order: Order; onDecide: (o: Order, s: 'verified' | 'rejected') => Promise<void> }) {
  const [confirm, setConfirm] = useState<null | 'verified' | 'rejected'>(null);
  const [busy, setBusy] = useState(false);
  const item = o.items?.[0];
  const qty = o.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  const run = async (s: 'verified' | 'rejected') => {
    setBusy(true);
    await onDecide(o, s);
    setBusy(false);
    setConfirm(null);
  };

  return (
    <li className="grid gap-x-6 gap-y-3 border-b rule py-5 last:border-b-0 lg:grid-cols-[8rem_1.2fr_1.3fr_1fr_auto] lg:items-start">
      <div>
        <p className="font-board tracking-[0.04em]">{o.order_code}</p>
        <p className="text-[0.8125rem] text-ink-soft">{dateTime(o.created_at)}</p>
      </div>
      <div>
        <p className="font-medium">{o.customer_name}</p>
        <p className="break-all text-[0.875rem] text-ink-soft">{o.customer_email}</p>
        <p className="text-[0.875rem] text-ink-soft tnum">{o.customer_phone}</p>
      </div>
      <div>
        <p>{cityOf(o.event_title || '')}</p>
        <p className="text-[0.875rem] text-ink-soft">
          {item?.tier_name} × {qty}
        </p>
      </div>
      <div>
        <p className="font-board text-[1.125rem] tnum">{rupiah(o.total_amount)}</p>
        <p className="text-[0.8125rem] text-ink-soft">
          {paymentLabel(o.payment?.payment_method)} · <span className="tnum">{o.payment?.payment_reference}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {o.status !== 'pending' ? (
          <StatusStamp status={o.status} />
        ) : confirm ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.875rem]">{confirm === 'verified' ? 'Pembayaran sudah masuk?' : 'Tolak? Kuota dikembalikan.'}</span>
            <button className={cx('btn btn-sm', confirm === 'verified' ? 'btn-ink' : 'btn-stamp')} disabled={busy} onClick={() => run(confirm)}>
              {busy ? '…' : 'Ya'}
            </button>
            <button className="btn btn-line btn-sm" disabled={busy} onClick={() => setConfirm(null)}>
              Batal
            </button>
          </div>
        ) : (
          <>
            <button className="btn btn-ink btn-sm" onClick={() => setConfirm('verified')}>
              Setujui
            </button>
            <button className="btn btn-line btn-sm" onClick={() => setConfirm('rejected')}>
              Tolak
            </button>
          </>
        )}
      </div>
    </li>
  );
}

/* ---------------- Kategori tiket ---------------- */
function Tiers() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    api.events
      .getAll()
      .then((r) => setEvents(r.data))
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  if (error) return <ErrorBox msg={error} />;
  if (!events) return <Loading onFelt />;

  return (
    <div className="space-y-10">
      {events.map((e) => (
        <section key={e.id}>
          <h2 className="on-felt flex flex-wrap items-baseline gap-x-3 text-chalk">
            <span className="board b-sm">{cityOf(e.title)}</span>
            <span className="text-[0.875rem] text-chalk-dim">{dateRange(e.event_date, e.end_date)}</span>
          </h2>
          <Paper className="mt-3 px-5 sm:px-6">
            <div className="hidden grid-cols-[1.6fr_8rem_7rem_6rem_8rem_auto] gap-4 border-b rule py-3 text-[0.8125rem] text-ink-soft md:grid">
              <span>Nama</span>
              <span>Harga (Rp)</span>
              <span>Kuota</span>
              <span>Terjual</span>
              <span>Status</span>
              <span />
            </div>
            <ul>
              {(e.ticket_tiers || []).map((t) => (
                <TierEditor key={t.id} tier={t} onSaved={load} />
              ))}
            </ul>
            <NewTier eventId={e.id} onSaved={load} />
          </Paper>
        </section>
      ))}
    </div>
  );
}

function TierEditor({ tier, onSaved }: { tier: TicketTier; onSaved: () => void }) {
  const [price, setPrice] = useState(String(tier.price));
  const [quota, setQuota] = useState(String(tier.total_quota));
  const [status, setStatus] = useState<TicketTier['status']>(tier.status);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const dirty = Number(price) !== tier.price || Number(quota) !== tier.total_quota || status !== tier.status;

  const save = async () => {
    setErr('');
    setMsg('');
    if (Number(quota) < tier.sold_count) return setErr(`Kuota tidak boleh kurang dari yang sudah terjual (${tier.sold_count}).`);
    if (!(Number(price) > 0)) return setErr('Harga harus lebih dari 0.');
    try {
      await api.tickets.update(tier.id, { price: Number(price), total_quota: Number(quota), status });
      setMsg('Tersimpan');
      onSaved();
    } catch (e: any) {
      setErr(e.message);
    }
  };
  const remove = async () => {
    if (!window.confirm(`Hapus kategori "${tier.name}"?`)) return;
    try {
      await api.tickets.delete(tier.id);
      onSaved();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <li className="border-b rule py-4">
      <div className="grid grid-cols-2 items-center gap-3 md:grid-cols-[1.6fr_8rem_7rem_6rem_8rem_auto] md:gap-4">
        <p className="col-span-2 font-medium md:col-span-1">{tier.name}</p>
        <label className="text-[0.8125rem] text-ink-soft md:text-base md:text-ink">
          <span className="md:sr-only">Harga (Rp)</span>
          <input className="field tnum" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} />
        </label>
        <label className="text-[0.8125rem] text-ink-soft md:text-base md:text-ink">
          <span className="md:sr-only">Kuota</span>
          <input className="field tnum" inputMode="numeric" value={quota} onChange={(e) => setQuota(e.target.value.replace(/\D/g, ''))} />
        </label>
        <p className="tnum">
          <span className="text-[0.8125rem] text-ink-soft md:hidden">Terjual </span>
          {tier.sold_count.toLocaleString('id-ID')}
        </p>
        <label>
          <span className="sr-only">Status penjualan</span>
          <select className="field" value={status} onChange={(e) => setStatus(e.target.value as TicketTier['status'])}>
            <option value="active">Dijual</option>
            <option value="closed">Ditutup</option>
            <option value="sold_out">Habis</option>
          </select>
        </label>
        <div className="col-span-2 flex items-center gap-2 md:col-span-1 md:justify-end">
          <button className="btn btn-ink btn-sm" disabled={!dirty} onClick={save}>
            Simpan
          </button>
          <button className="btn btn-line btn-sm px-2.5" onClick={remove} aria-label={`Hapus ${tier.name}`}>
            <Trash size={16} />
          </button>
        </div>
      </div>
      {(msg || err) && <p className={cx('mt-2 text-[0.875rem]', err ? 'text-stamp' : 'text-ink-soft')}>{err || msg}</p>}
    </li>
  );
}

function NewTier({ eventId, onSaved }: { eventId: number; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: '', price: '', quota: '', description: '', perks: '' });
  const [err, setErr] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!f.name.trim() || !(Number(f.price) > 0) || !(Number(f.quota) > 0)) return setErr('Nama, harga, dan kuota wajib diisi dengan benar.');
    try {
      await api.tickets.create({
        event_id: eventId,
        name: f.name.trim(),
        price: Number(f.price),
        total_quota: Number(f.quota),
        description: f.description.trim(),
        perks_json: f.perks.split(',').map((x) => x.trim()).filter(Boolean),
        status: 'active',
      });
      setF({ name: '', price: '', quota: '', description: '', perks: '' });
      setOpen(false);
      onSaved();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (!open)
    return (
      <div className="py-4">
        <button className="btn btn-line btn-sm" onClick={() => setOpen(true)}>
          Tambah kategori
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="grid gap-4 py-5 sm:grid-cols-3">
      <Field label="Nama kategori" id={`tn-${eventId}`}>
        <input id={`tn-${eventId}`} className="field" value={f.name} onChange={set('name')} placeholder="Tiket Sabtu" />
      </Field>
      <Field label="Harga (Rp)" id={`tp-${eventId}`}>
        <input id={`tp-${eventId}`} className="field tnum" inputMode="numeric" value={f.price} onChange={set('price')} />
      </Field>
      <Field label="Kuota" id={`tq-${eventId}`}>
        <input id={`tq-${eventId}`} className="field tnum" inputMode="numeric" value={f.quota} onChange={set('quota')} />
      </Field>
      <Field label="Keterangan" id={`td-${eventId}`} className="sm:col-span-3">
        <input id={`td-${eventId}`} className="field" value={f.description} onChange={set('description')} />
      </Field>
      <Field label="Fasilitas" id={`tf-${eventId}`} hint="Pisahkan dengan koma." className="sm:col-span-3">
        <input id={`tf-${eventId}`} className="field" value={f.perks} onChange={set('perks')} placeholder="Gelang kain festival, Akses ketiga panggung" />
      </Field>
      {err && (
        <div className="sm:col-span-3">
          <ErrorNote>{err}</ErrorNote>
        </div>
      )}
      <div className="flex gap-2 sm:col-span-3">
        <button className="btn btn-ink btn-sm" type="submit">
          Simpan kategori
        </button>
        <button className="btn btn-line btn-sm" type="button" onClick={() => setOpen(false)}>
          Batal
        </button>
      </div>
    </form>
  );
}

/* ---------------- Acara ---------------- */
function Events() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    api.events
      .getAll()
      .then((r) => setEvents(r.data))
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const toggle = async (e: Event) => {
    try {
      await api.events.toggleSales(e.id, e.status === 'open' ? 'closed' : 'open');
      load();
    } catch (er: any) {
      setError(er.message);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {error && <ErrorBox msg={error} />}
        {!events && !error && <Loading onFelt />}
        {events && (
          <Paper className="px-5 sm:px-6">
            <ul>
              {events.map((e) => (
                <li key={e.id} className="grid gap-3 border-b rule py-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-[0.875rem] text-ink-soft">
                      {dateRange(e.event_date, e.end_date)} · {e.venue_name}
                    </p>
                    <p className="text-[0.8125rem] text-ink-soft">
                      {(e.ticket_tiers || []).length} kategori · {(e.lineup || []).length} penampil
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cx('stamp', e.status === 'open' ? 'stamp-paid' : 'stamp-pending')}>{e.status === 'open' ? 'Dijual' : 'Ditutup'}</span>
                    <button className="btn btn-line btn-sm" onClick={() => toggle(e)}>
                      {e.status === 'open' ? 'Tutup penjualan' : 'Buka penjualan'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Paper>
        )}
      </div>
      <div className="lg:col-span-5">
        <NewEvent onSaved={load} />
      </div>
    </div>
  );
}

function NewEvent({ onSaved }: { onSaved: () => void }) {
  const [f, setF] = useState({ city: '', venue: '', address: '', start: '', end: '', description: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setOk('');
    if (!f.city.trim() || !f.venue.trim() || !f.start) return setErr('Kota, tempat, dan tanggal mulai wajib diisi.');
    if (f.end && f.end < f.start) return setErr('Tanggal selesai tidak boleh sebelum tanggal mulai.');
    const year = new Date(f.start).getFullYear();
    try {
      await api.events.create({
        title: `Gelar Tikar ${year} ${f.city.trim()}`,
        venue_name: f.venue.trim(),
        venue_address: f.address.trim(),
        event_date: new Date(f.start).toISOString(),
        end_date: f.end ? new Date(f.end).toISOString() : undefined,
        description: f.description.trim(),
        status: 'closed',
      });
      setOk('Acara ditambahkan dengan penjualan ditutup. Tambahkan kategori tiket dulu, lalu buka penjualannya.');
      setF({ city: '', venue: '', address: '', start: '', end: '', description: '' });
      onSaved();
    } catch (er: any) {
      setErr(er.message);
    }
  };

  return (
    <Paper pin pinAt="50%" warm className="px-6 pb-6 pt-8">
      <h2 className="font-board text-[1.25rem] font-medium">Tambah acara</h2>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <Field label="Kota" id="ev-city" hint="Judul otomatis: Gelar Tikar <tahun> <kota>.">
          <input id="ev-city" className="field" value={f.city} onChange={set('city')} placeholder="Malang" />
        </Field>
        <Field label="Tempat" id="ev-venue">
          <input id="ev-venue" className="field" value={f.venue} onChange={set('venue')} />
        </Field>
        <Field label="Alamat" id="ev-addr">
          <input id="ev-addr" className="field" value={f.address} onChange={set('address')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mulai" id="ev-start">
            <input id="ev-start" type="datetime-local" className="field" value={f.start} onChange={set('start')} />
          </Field>
          <Field label="Selesai" id="ev-end">
            <input id="ev-end" type="datetime-local" className="field" value={f.end} onChange={set('end')} />
          </Field>
        </div>
        <Field label="Keterangan" id="ev-desc">
          <textarea id="ev-desc" rows={3} className="field" value={f.description} onChange={set('description')} />
        </Field>
        {err && <ErrorNote>{err}</ErrorNote>}
        {ok && (
          <p className="text-[0.9375rem] text-ink" role="status">
            {ok}
          </p>
        )}
        <button className="btn btn-ink" type="submit">
          Simpan acara
        </button>
      </form>
    </Paper>
  );
}

/* ---------------- Band ---------------- */
function Artists() {
  const [list, setList] = useState<Artist[] | null>(null);
  const [error, setError] = useState('');
  const [f, setF] = useState({ name: '', genre: '', bio: '' });
  const [formErr, setFormErr] = useState('');

  const load = useCallback(() => {
    api.artists
      .getAll()
      .then((r) => setList(r.data))
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    if (!f.name.trim() || !f.genre.trim()) return setFormErr('Nama dan genre wajib diisi.');
    try {
      await api.artists.create({ name: f.name.trim(), genre: f.genre.trim(), bio: f.bio.trim() });
      setF({ name: '', genre: '', bio: '' });
      load();
    } catch (er: any) {
      setFormErr(er.message);
    }
  };
  const remove = async (a: Artist) => {
    if (!window.confirm(`Hapus ${a.name}? Band ini juga hilang dari jadwal.`)) return;
    try {
      await api.artists.delete(a.id);
      load();
    } catch (er: any) {
      setError(er.message);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {error && <ErrorBox msg={error} />}
        {!list && !error && <Loading onFelt />}
        {list && (
          <Paper className="px-5 sm:px-6">
            <ul>
              {list.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 border-b rule py-4 last:border-b-0">
                  <div>
                    <p className="font-medium">
                      {a.name} <span className="font-normal text-ink-soft">· {a.genre}</span>
                    </p>
                    {a.bio && <p className="max-w-[60ch] text-[0.875rem] text-ink-soft">{a.bio}</p>}
                  </div>
                  <button className="btn btn-line btn-sm px-2.5" onClick={() => remove(a)} aria-label={`Hapus ${a.name}`}>
                    <Trash size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </Paper>
        )}
      </div>
      <Paper pin pinAt="50%" warm className="px-6 pb-6 pt-8 lg:col-span-5">
        <h2 className="font-board text-[1.25rem] font-medium">Tambah band</h2>
        <form onSubmit={add} className="mt-4 space-y-4">
          <Field label="Nama band / penyanyi" id="ar-name">
            <input id="ar-name" className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </Field>
          <Field label="Genre" id="ar-genre">
            <input id="ar-genre" className="field" value={f.genre} onChange={(e) => setF({ ...f, genre: e.target.value })} placeholder="Folk" />
          </Field>
          <Field label="Profil singkat" id="ar-bio">
            <textarea id="ar-bio" rows={3} className="field" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
          </Field>
          {formErr && <ErrorNote>{formErr}</ErrorNote>}
          <button className="btn btn-ink" type="submit">
            Simpan band
          </button>
        </form>
      </Paper>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <Paper className="mt-4 max-w-xl p-5">
      <ErrorNote>{msg}</ErrorNote>
    </Paper>
  );
}
