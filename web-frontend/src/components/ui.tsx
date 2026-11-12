import React from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import type { Order } from '../api/client';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export { cx };

/**
 * Teks huruf papan. Setiap huruf dirender sebagai "huruf plastik" terpisah
 * supaya bisa ditancapkan satu per satu saat muncul (sekali, saat teks berubah).
 */
export function BoardText({
  text,
  as: Tag = 'span',
  className,
  offset = 0,
  animate = true,
}: {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  offset?: number;
  animate?: boolean;
}) {
  const T = Tag as any;
  // Kata dibungkus utuh supaya baris hanya patah di spasi, bukan di tengah kata.
  let i = offset;
  const words = text.split(' ');
  return (
    <T className={cx('board', animate && 'board-in', className)} aria-label={text} key={text}>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          {wi > 0 && ' '}
          <span aria-hidden="true" className="whitespace-nowrap">
            {Array.from(w).map((ch) => (
              <span className="board-ch" style={{ ['--i' as any]: i++ }} key={i}>
                {ch}
              </span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </T>
  );
}

export function Paper({
  children,
  className,
  pin = false,
  pinAt = '50%',
  tilt = 0,
  warm = false,
  as: Tag = 'div',
  ...rest
}: React.HTMLAttributes<HTMLElement> & { pin?: boolean; pinAt?: string; tilt?: number; warm?: boolean; as?: any }) {
  return (
    <Tag className={cx('paper', warm && 'paper-warm', className)} style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined} {...rest}>
      {pin && <span className="pin" style={{ left: `calc(${pinAt} - 7px)` }} aria-hidden="true" />}
      {children}
    </Tag>
  );
}

// Status memakai tinta dan satu merah stempel saja:
// menunggu = garis tinta putus-putus, lunas = stempel merah, ditolak = stempel merah dicoret.
const STATUS: Record<Order['status'], { label: string; cls: string }> = {
  pending: { label: 'Menunggu verifikasi', cls: 'stamp-pending' },
  paid: { label: 'Lunas', cls: 'stamp-paid' },
  rejected: { label: 'Ditolak', cls: 'stamp-rejected' },
  cancelled: { label: 'Dibatalkan', cls: 'stamp-pending' },
};

export function StatusStamp({ status, className }: { status: Order['status']; className?: string }) {
  const s = STATUS[status] || STATUS.pending;
  return <span className={cx('stamp', s.cls, className)}>{s.label}</span>;
}

/**
 * Meter kuota. Semua kategori digambar pada skala yang sama (maxQuota),
 * sehingga panjang garis menunjukkan besar kuota dan bagian gelap menunjukkan yang sudah terjual.
 */
export function QuotaMeter({ sold, quota, maxQuota }: { sold: number; quota: number; maxQuota: number }) {
  const w = Math.max(8, (quota / maxQuota) * 100);
  const filled = quota ? Math.min(100, (sold / quota) * 100) : 100;
  const left = Math.max(0, quota - sold);
  return (
    <div>
      <div className="h-[6px] bg-paper-warm" style={{ width: `${w}%` }} aria-hidden="true">
        <div className="h-full bg-ink/80" style={{ width: `${filled}%` }} />
      </div>
      <p className="mt-1.5 text-[0.8125rem] text-ink-soft tnum">
        {left > 0 ? (
          <>
            Sisa <span className="text-ink">{left.toLocaleString('id-ID')}</span> dari {quota.toLocaleString('id-ID')}
          </>
        ) : (
          'Kuota habis'
        )}
      </p>
    </div>
  );
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="flex items-start gap-2 text-[0.9375rem] text-stamp">
      <WarningCircle size={20} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function Loading({ label = 'Memuat…', onFelt = false }: { label?: string; onFelt?: boolean }) {
  return (
    <p className={cx('py-10 text-center text-[0.9375rem]', onFelt ? 'text-chalk-dim' : 'text-ink-soft')} role="status">
      {label}
    </p>
  );
}

/** Judul bagian di atas papan: huruf papan berukuran sedang. */
export function SectionTitle({ children, id, sub }: { children: string; id?: string; sub?: string }) {
  return (
    <div className="mb-6" id={id}>
      <BoardText as="h2" text={children} className="b-lg" animate={false} />
      {sub && <p className="mt-1 max-w-[60ch] text-chalk-dim">{sub}</p>}
    </div>
  );
}

export function Field({
  label,
  id,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-[0.875rem] text-stamp">{error}</p> : hint ? <p className="mt-1.5 text-[0.8125rem] text-ink-soft">{hint}</p> : null}
    </div>
  );
}

/** Garis sobekan karcis: titik-titik dengan takik setengah lingkaran di kedua tepi kertas. */
export function Tear({ className }: { className?: string }) {
  return (
    <div className={cx('relative', className)} aria-hidden="true">
      <div className="perforation mx-5" />
      <span className="absolute -left-[9px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-felt shadow-[inset_-2px_0_3px_rgba(0,0,0,0.25)]" />
      <span className="absolute -right-[9px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-felt shadow-[inset_2px_0_3px_rgba(0,0,0,0.25)]" />
    </div>
  );
}
