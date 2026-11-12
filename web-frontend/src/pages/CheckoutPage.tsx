import React, { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus } from '@phosphor-icons/react';
import { api, Event, TicketTier } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { go, href } from '../lib/router';
import { cityOf, dateRange, rupiah, MAX_PER_ORDER, SERVICE_FEE } from '../lib/format';
import { BoardText, ErrorNote, Field, Loading, Paper, Tear, cx } from '../components/ui';

type Method = 'qris' | 'virtual_account';

export function CheckoutPage({ tierId, initialQty }: { tierId: number; initialQty: number }) {
  const { user, isLoggedIn, isLoading, isAdmin } = useAuth();
  const [data, setData] = useState<{ event: Event; tier: TicketTier } | null>(null);
  const [loadError, setLoadError] = useState('');

  const [qty, setQty] = useState(Math.min(MAX_PER_ORDER, Math.max(1, initialQty || 1)));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [method, setMethod] = useState<Method>('qris');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [sending, setSending] = useState(false);

  // Halaman pesan hanya untuk pengguna yang sudah masuk.
  useEffect(() => {
    if (!isLoading && !isLoggedIn) go(`/masuk?next=${encodeURIComponent(`/pesan/${tierId}?qty=${qty}`)}`);
  }, [isLoading, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) {
      setName((n) => n || user.name);
      setPhone((p) => p || user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    api.events
      .getAll()
      .then((r) => {
        for (const ev of r.data) {
          const t = ev.ticket_tiers?.find((x) => x.id === tierId);
          if (t) return setData({ event: ev, tier: t });
        }
        setLoadError('Kategori tiket tidak ditemukan.');
      })
      .catch((e) => setLoadError(e.message));
  }, [tierId]);

  if (loadError)
    return (
      <Wrap>
        <Paper className="max-w-xl p-6">
          <ErrorNote>{loadError}</ErrorNote>
          <a href={href('/')} className="link mt-4 inline-block">
            Kembali ke daftar tiket
          </a>
        </Paper>
      </Wrap>
    );
  if (!data || isLoading) return <Loading onFelt />;

  const { event, tier } = data;
  const left = Math.max(0, tier.total_quota - tier.sold_count);
  const maxQty = Math.min(MAX_PER_ORDER, left);
  const available = event.status === 'open' && tier.status === 'active' && left > 0;
  const subtotal = tier.price * qty;
  const total = subtotal + SERVICE_FEE;

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = 'Tulis nama lengkap sesuai kartu identitas.';
    if (!/^0\d{9,13}$/.test(phone.replace(/[\s-]/g, ''))) e.phone = 'Nomor HP diawali 0, 10 sampai 14 angka. Contoh: 081234567890.';
    if (idCard && !/^\d{8,16}$/.test(idCard)) e.idCard = 'Isi dengan angka saja (8 sampai 16 digit), atau kosongkan.';
    if (!agree) e.agree = 'Centang persetujuan dulu sebelum memesan.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    if (!validate() || !user) return;
    setSending(true);
    try {
      const res = await api.orders.create({
        event_id: event.id,
        tier_id: tier.id,
        quantity: qty,
        customer_name: name.trim(),
        customer_email: user.email,
        customer_phone: phone.replace(/[\s-]/g, ''),
        customer_id_card: idCard || undefined,
        payment_method: method,
      });
      go(`/pesanan/${res.data.order_code}?baru=1`);
    } catch (e: any) {
      setSubmitError(e.message || 'Pesanan gagal dibuat. Coba lagi.');
      setSending(false);
    }
  };

  return (
    <Wrap>
      <a href={href(`/acara/${event.slug}`)} className="on-felt inline-flex items-center gap-2 text-chalk-dim no-underline hover:text-chalk">
        <ArrowLeft size={18} /> Kembali ke {event.title}
      </a>
      <BoardText as="h1" text="Pesan tiket" className="b-lg mt-4 block" />

      {isAdmin ? (
        <Paper className="mt-6 max-w-xl p-6">
          <p>Akun panitia tidak dipakai untuk membeli tiket. Masuk dengan akun pembeli untuk mencoba alur pemesanan.</p>
        </Paper>
      ) : !available ? (
        <Paper className="mt-6 max-w-xl p-6">
          <p>Kategori {tier.name} sedang tidak dijual atau kuotanya habis.</p>
          <a href={href(`/acara/${event.slug}`)} className="link mt-3 inline-block">
            Lihat kategori lain
          </a>
        </Paper>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6 grid items-start gap-8 lg:grid-cols-12">
          {/* Formulir */}
          <Paper pin pinAt="12%" className="px-5 pb-7 pt-8 sm:px-8 lg:col-span-7">
            <fieldset>
              <legend className="font-board text-[1.25rem] font-medium">Data pemegang tiket</legend>
              <p className="mt-1 text-[0.9375rem] text-ink-soft">Nama ini dicetak di e-tiket dan dicocokkan dengan kartu identitas di gerbang.</p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Nama lengkap" id="nama" error={errors.name} className="sm:col-span-2">
                  <input id="nama" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
                </Field>
                <Field label="Email akun" id="email" hint="E-tiket dikirim ke akun ini.">
                  <input id="email" className="field bg-paper-warm text-ink-soft" value={user?.email || ''} readOnly />
                </Field>
                <Field label="Nomor HP (WhatsApp)" id="hp" error={errors.phone}>
                  <input id="hp" className="field tnum" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="081234567890" aria-invalid={!!errors.phone} />
                </Field>
                <Field label="Nomor KTP / kartu pelajar" id="ktp" hint="Opsional." error={errors.idCard} className="sm:col-span-2">
                  <input id="ktp" className="field tnum" inputMode="numeric" value={idCard} onChange={(e) => setIdCard(e.target.value.replace(/\D/g, ''))} aria-invalid={!!errors.idCard} />
                </Field>
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-board text-[1.25rem] font-medium">Cara bayar</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ['qris', 'QRIS', 'Pindai kode QR dengan aplikasi bank atau dompet digital.'],
                    ['virtual_account', 'Virtual Account', 'Transfer ke nomor rekening khusus pesanan ini.'],
                  ] as [Method, string, string][]
                ).map(([val, label, desc]) => (
                  <label
                    key={val}
                    className={cx(
                      'flex cursor-pointer gap-3 border p-4 transition-colors',
                      method === val ? 'border-ink bg-[#fffdf8]' : 'border-[#c9c1ab] hover:border-[#a69d85]'
                    )}
                  >
                    <input type="radio" name="method" value={val} checked={method === val} onChange={() => setMethod(val)} className="mt-1 accent-[#b83a24]" />
                    <span>
                      <span className="block font-medium">{label}</span>
                      <span className="block text-[0.875rem] text-ink-soft">{desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-[#b83a24]" aria-invalid={!!errors.agree} />
                <span className="text-[0.9375rem]">Saya setuju bahwa tiket yang sudah lunas tidak bisa dikembalikan dan satu kode QR berlaku untuk semua tiket di pesanan ini.</span>
              </label>
              {errors.agree && <p className="mt-2 text-[0.875rem] text-stamp">{errors.agree}</p>}
            </div>
          </Paper>

          {/* Ringkasan sebagai karcis */}
          <div className="lg:sticky lg:top-6 lg:col-span-5">
            <Paper pin pinAt="50%" tilt={0.6} className="px-6 pb-6 pt-7">
              <p className="text-[0.875rem] text-ink-soft">{cityOf(event.title)} · {dateRange(event.event_date, event.end_date)}</p>
              <p className="mt-1 font-board text-[1.5rem] font-medium leading-tight">{tier.name}</p>
              <p className="text-[0.875rem] text-ink-soft">{event.venue_name}</p>

              <div className="mt-5 flex items-center justify-between">
                <span>Jumlah tiket</span>
                <div className="flex h-10 items-center border border-[#c9c1ab]" role="group" aria-label="Jumlah tiket">
                  <button type="button" className="grid h-full w-9 place-items-center disabled:opacity-40" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Kurangi">
                    <Minus size={14} />
                  </button>
                  <output className="w-8 text-center tnum">{qty}</output>
                  <button type="button" className="grid h-full w-9 place-items-center disabled:opacity-40" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Tambah">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <Tear className="-mx-6 my-5" />

              <dl className="space-y-2 text-[0.9375rem] tnum">
                <Row k={`${qty} × ${rupiah(tier.price)}`} v={rupiah(subtotal)} />
                <Row k="Biaya layanan" v={rupiah(SERVICE_FEE)} />
                <div className="flex justify-between border-t rule pt-3 text-[1.125rem]">
                  <dt className="font-medium">Total bayar</dt>
                  <dd className="font-board text-[1.375rem] font-medium">{rupiah(total)}</dd>
                </div>
              </dl>

              {submitError && (
                <div className="mt-4">
                  <ErrorNote>{submitError}</ErrorNote>
                </div>
              )}
              <button type="submit" className="btn btn-stamp mt-5 w-full" disabled={sending}>
                {sending ? 'Membuat pesanan…' : 'Buat pesanan'}
              </button>
              <p className="mt-3 text-[0.8125rem] text-ink-soft">Kuota disimpan untukmu begitu pesanan dibuat. Instruksi pembayaran muncul di langkah berikutnya.</p>
            </Paper>
          </div>
        </form>
      )}
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-page px-4 pt-6 sm:px-6">{children}</div>;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-soft">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
