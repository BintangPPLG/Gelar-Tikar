const TZ = 'Asia/Jakarta';

export const rupiah = (n: number) => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID');

export const shortDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: TZ }) : '';

export const longDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }) : '';

export const dateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ })
    : '';

/** Rentang tanggal acara, mis. "19–21 Februari 2027" atau "13 Maret 2027". */
export function dateRange(start?: string, end?: string) {
  if (!start) return '';
  const s = new Date(start);
  const e = end ? new Date(end) : s;
  const part = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('id-ID', { ...o, timeZone: TZ });
  const sameDay = part(s, { dateStyle: 'short' }) === part(e, { dateStyle: 'short' });
  if (sameDay) return part(s, { day: 'numeric', month: 'long', year: 'numeric' });
  const sameMonth = part(s, { month: 'long', year: 'numeric' }) === part(e, { month: 'long', year: 'numeric' });
  if (sameMonth) return `${part(s, { day: 'numeric' })}–${part(e, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  return `${part(s, { day: 'numeric', month: 'short' })} – ${part(e, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

/** Tanggal untuk hari ke-n acara. */
export function dayDate(start: string, day: number) {
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + (day - 1));
  return d.toISOString();
}

export const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', timeZone: TZ }).replace('.', '');

export const cityOf = (title: string) => title.replace(/^Gelar Tikar\s+\d{4}\s*/i, '').trim() || title;

export const paymentLabel = (m?: string) => (m === 'virtual_account' ? 'Virtual Account' : m === 'qris' ? 'QRIS' : m || '-');

/** Gerbang masuk: pemegang tiket terusan punya jalur sendiri di Gerbang 2. */
export const gateFor = (tierName?: string) => (tierName && /terusan/i.test(tierName) ? 'Gerbang 2' : 'Gerbang 1');

/** Sama dengan aturan di backend (store.ts). */
export const MAX_PER_ORDER = 4;
export const SERVICE_FEE = 10000;
