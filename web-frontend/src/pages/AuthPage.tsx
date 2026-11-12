import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { go, href } from '../lib/router';
import { BoardText, ErrorNote, Field, Paper, cx } from '../components/ui';

export function AuthPage({ mode, next }: { mode: 'masuk' | 'daftar'; next?: string }) {
  const { login, register, isLoggedIn, isAdmin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const target = next && next.startsWith('/') ? next : '/';
  const qs = next ? `?next=${encodeURIComponent(next)}` : '';

  // Sudah masuk: lanjutkan ke tujuan (admin ke panel panitia).
  useEffect(() => {
    if (isLoggedIn) go(isAdmin && !next ? '/admin' : target);
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setError(''), [mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'daftar') {
      if (name.trim().length < 3) return setError('Tulis nama lengkap (minimal 3 huruf).');
      if (password.length < 6) return setError('Password minimal 6 karakter.');
    }
    setBusy(true);
    try {
      if (mode === 'masuk') await login({ email: email.trim(), password });
      else await register({ name: name.trim(), email: email.trim(), password, phone: phone.trim() });
    } catch (err: any) {
      setError(err.message || 'Gagal. Coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (who: 'pembeli' | 'panitia') => {
    if (who === 'pembeli') {
      setEmail('raditya@example.com');
      setPassword('User12345!');
    } else {
      setEmail('admin@gelartikar.id');
      setPassword('Admin12345!');
    }
  };

  return (
    <div className="mx-auto grid max-w-page items-start gap-10 px-4 pt-8 sm:px-6 lg:grid-cols-12">
      <div className="lg:col-span-5 lg:pt-6">
        <BoardText as="h1" text={mode === 'masuk' ? 'Masuk' : 'Daftar akun'} className="b-lg block" />
        <p className="mt-2 max-w-[40ch] text-chalk-dim">
          {next
            ? 'Masuk dulu supaya pesanan tercatat di akunmu. Setelah itu kamu langsung kembali ke halaman pemesanan.'
            : 'Akun dipakai untuk menyimpan pesanan dan e-tiket. Panitia memakai halaman yang sama untuk masuk ke panel panitia.'}
        </p>
      </div>

      <Paper pin pinAt="50%" className="px-5 pb-7 pt-8 sm:px-8 lg:col-span-6 lg:col-start-7">
        <div className="mb-6 grid grid-cols-2 border border-[#c9c1ab] p-1" role="tablist">
          {(['masuk', 'daftar'] as const).map((m) => (
            <a
              key={m}
              role="tab"
              aria-selected={mode === m}
              href={href(`/${m}${qs}`)}
              className={cx('py-2 text-center text-[0.9375rem] no-underline', mode === m ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink')}
            >
              {m === 'masuk' ? 'Masuk' : 'Daftar'}
            </a>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-5" noValidate>
          {mode === 'daftar' && (
            <Field label="Nama lengkap" id="nama">
              <input id="nama" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </Field>
          )}
          <Field label="Email" id="email">
            <input id="email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </Field>
          {mode === 'daftar' && (
            <Field label="Nomor HP (WhatsApp)" id="hp" hint="Opsional, dipakai untuk mengisi data pesanan.">
              <input id="hp" className="field tnum" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </Field>
          )}
          <Field label="Password" id="pw" hint={mode === 'daftar' ? 'Minimal 6 karakter.' : undefined}>
            <input
              id="pw"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'masuk' ? 'current-password' : 'new-password'}
              required
            />
          </Field>

          {error && <ErrorNote>{error}</ErrorNote>}

          <button type="submit" className="btn btn-stamp w-full" disabled={busy}>
            {busy ? 'Memproses…' : mode === 'masuk' ? 'Masuk' : 'Daftar dan masuk'}
          </button>
        </form>

        {mode === 'masuk' && (
          <div className="mt-7 border-t rule pt-5 text-[0.875rem] text-ink-soft">
            <p>Akun contoh untuk demo:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="btn btn-line btn-sm" onClick={() => fillDemo('pembeli')}>
                Isi akun pembeli
              </button>
              <button type="button" className="btn btn-line btn-sm" onClick={() => fillDemo('panitia')}>
                Isi akun panitia
              </button>
            </div>
          </div>
        )}
      </Paper>
    </div>
  );
}
