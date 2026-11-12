import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LockKey, Envelope, User as UserIcon, Phone, CheckCircle, Warning, ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { playClickBeep, playSuccessChime } from '../../audio/synthAudio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: 'login' | 'register';
  redirectMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'login',
  redirectMessage = null,
}) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  // Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSwitchTab = (newTab: 'login' | 'register') => {
    playClickBeep();
    setTab(newTab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login({ email: loginEmail, password: loginPassword });
      playSuccessChime();
      setSuccessMessage('Login berhasil! Mengalihkan ke portal festival...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
      });
      playSuccessChime();
      setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke portal festival...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md bg-[#111319] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Accent */}
        <div className="h-1 w-full bg-acid" />

        {/* Close Button */}
        <button
          onClick={() => {
            playClickBeep();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/10 btn-tactile cursor-pointer"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-acid">
              <span className="w-2.5 h-2.5 rounded-full bg-acid" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                AURORA<span className="text-acid">PULSE</span>
              </h2>
              <p className="text-[11px] font-mono text-zinc-400 uppercase">PORTAL AKSES FESTIVAL RESMI</p>
            </div>
          </div>

          {redirectMessage && (
            <div className="mt-3 p-3 rounded-xl bg-acid/10 border border-acid/30 text-acid text-xs flex items-center gap-2">
              <Warning size={16} weight="fill" className="shrink-0" />
              <span>{redirectMessage}</span>
            </div>
          )}

          {/* Segmented Tab Switcher */}
          <div className="flex bg-black/50 p-1 rounded-2xl border border-white/5 my-5">
            <button
              type="button"
              onClick={() => handleSwitchTab('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all btn-tactile cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab('register')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all btn-tactile cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
              <Warning size={16} weight="fill" className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab 1: LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">Alamat Email</label>
                <div className="relative">
                  <Envelope size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">Kata Sandi</label>
                <div className="relative">
                  <LockKey size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-acid text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-acid/20 btn-tactile hover:brightness-105 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Memproses...' : 'Masuk Sekarang'}</span>
                {!isLoading && <ArrowRight size={14} weight="bold" />}
              </button>

              {/* Quick Demo Credentials */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-[11px] font-mono text-zinc-400 mb-2">
                  Akses Cepat Akun Demo:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('admin@aurorapulse.com');
                      setLoginPassword('AdminAurora2026!');
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-acid/40 text-left transition-all btn-tactile cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-white flex items-center gap-1">
                      <ShieldCheck size={14} className="text-cobalt" />
                      <span>Admin</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">admin@aurorapulse.com</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('customer@gmail.com');
                      setLoginPassword('User12345!');
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-acid/40 text-left transition-all btn-tactile cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-white flex items-center gap-1">
                      <UserIcon size={14} className="text-acid" />
                      <span>User Demo</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">customer@gmail.com</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Tab 2: REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Alamat Email Aktif</label>
                <div className="relative">
                  <Envelope size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Nomor WhatsApp / Ponsel</label>
                <div className="relative">
                  <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Buat Kata Sandi</label>
                <div className="relative">
                  <LockKey size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                  />
                </div>
              </div>

              <p className="text-[10px] text-zinc-400">
                Akun terdaftar otomatis tersimpan ke database dan terautentikasi langsung untuk memesan tiket.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-acid text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-acid/20 btn-tactile hover:brightness-105 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Menyimpan...' : 'Daftar & Masuk Otomatis'}</span>
                {!isLoading && <ArrowRight size={14} weight="bold" />}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
