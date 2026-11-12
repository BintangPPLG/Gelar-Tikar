import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle, 
  QrCode, 
  Bank, 
  Ticket, 
  Copy,
  Check,
  Warning,
  ArrowRight,
  ArrowLeft
} from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { api, TicketTier, Order } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { playClickBeep, playSuccessChime } from '../audio/synthAudio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: TicketTier | null;
  quantity: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  tier,
  quantity,
}) => {
  const { user, isLoggedIn } = useAuth();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'virtual_account' | 'credit_card'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedVa, setCopiedVa] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        idNumber: '',
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !tier) return null;

  const totalPrice = tier.price * quantity;
  const adminFee = 25000;
  const grandTotal = totalPrice + adminFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    playClickBeep();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMsg('Mohon lengkapi nama, email, dan nomor telepon pemesan.');
      return;
    }
    setErrorMsg(null);
    setStep('payment');
  };

  const handleProcessPayment = async () => {
    playClickBeep();
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await api.orders.create({
        event_id: tier.event_id || 1,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_id_card: formData.idNumber || '3171000000000000',
        tier_id: tier.id,
        quantity: quantity,
        payment_method: paymentMethod,
      });

      if (res.success && res.data) {
        setCreatedOrder(res.data);
        const ticketCode = res.data.items?.[0]?.ticket_code || res.data.order_code;
        const qrUrl = await QRCode.toDataURL(ticketCode, { width: 280, margin: 2 });
        setQrCodeDataUrl(qrUrl);

        setStep('success');
        playSuccessChime();

        try {
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#d4ff00', '#3b82f6', '#ffffff', '#10b981'],
          });
        } catch {
          // fallback
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses pesanan tiket.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyVa = () => {
    navigator.clipboard.writeText('8801928374619283');
    setCopiedVa(true);
    playClickBeep();
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handleClose = () => {
    playClickBeep();
    setStep('form');
    setCreatedOrder(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-lg bg-[#111319] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Subtle Top Accent */}
          <div className="h-1 w-full bg-acid" />

          {/* Modal Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-acid">
                <Ticket size={22} weight="fill" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  {step === 'form' && 'Data Pemesan Tiket'}
                  {step === 'payment' && 'Metode & Pembayaran'}
                  {step === 'success' && 'E-Ticket Diterbitkan!'}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {tier.name} • {quantity} Tiket
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/10 btn-tactile cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="grid grid-cols-3 bg-black/40 border-b border-white/5 text-center text-[11px] font-mono py-3 px-4">
            <div className={`flex items-center justify-center gap-1.5 ${step === 'form' ? 'text-acid font-bold' : 'text-zinc-500'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 'form' ? 'bg-acid text-black font-bold' : 'bg-white/10'}`}>1</span>
              <span>Data Diri</span>
            </div>
            <div className={`flex items-center justify-center gap-1.5 ${step === 'payment' ? 'text-acid font-bold' : 'text-zinc-500'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-acid text-black font-bold' : 'bg-white/10'}`}>2</span>
              <span>Bayar</span>
            </div>
            <div className={`flex items-center justify-center gap-1.5 ${step === 'success' ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 'success' ? 'bg-emerald-400 text-black font-bold' : 'bg-white/10'}`}>3</span>
              <span>E-Ticket QR</span>
            </div>
          </div>

          {errorMsg && (
            <div className="m-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <Warning size={16} weight="fill" className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6">
            {/* STEP 1: FORM DATA DIRI */}
            {step === 'form' && (
              <form onSubmit={handleSubmitForm} className="space-y-4">
                {isLoggedIn && (
                  <div className="p-3 rounded-xl bg-acid/10 border border-acid/20 text-xs font-mono text-zinc-200 flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" className="text-acid" />
                    <span>Akun terhubung: <strong className="text-white">{user?.name}</strong></span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">Nama Lengkap (Sesuai KTP/Paspor)</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nama Lengkap Anda"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">Alamat Email</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="08123456789"
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5 font-medium">NIK KTP / Paspor (Opsional)</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="3171000000000000"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-acid transition-colors"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>{tier.name} ({quantity}x)</span>
                    <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Biaya Layanan & Pajak Hiburan</span>
                    <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                    <span>Total Pembayaran</span>
                    <span className="text-acid font-mono-num">Rp {grandTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-acid text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-acid/20 btn-tactile hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </form>
            )}

            {/* STEP 2: METODE PEMBAYARAN */}
            {step === 'payment' && (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  <label className="block text-xs font-mono text-zinc-300 font-medium">Pilih Metode Pembayaran Resmi</label>

                  {/* QRIS */}
                  <div
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all btn-tactile ${
                      paymentMethod === 'qris'
                        ? 'bg-acid/10 border-acid text-white'
                        : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode size={22} className={paymentMethod === 'qris' ? 'text-acid' : 'text-zinc-500'} />
                      <div>
                        <div className="text-sm font-bold text-white">QRIS Instant (GoPay, OVO, BCA, Dana)</div>
                        <div className="text-[11px] font-mono text-zinc-400">Verifikasi otomatis instan</div>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center p-0.5">
                      {paymentMethod === 'qris' && <span className="w-full h-full bg-acid rounded-full" />}
                    </span>
                  </div>

                  {/* Virtual Account */}
                  <div
                    onClick={() => setPaymentMethod('virtual_account')}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all btn-tactile ${
                      paymentMethod === 'virtual_account'
                        ? 'bg-acid/10 border-acid text-white'
                        : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bank size={22} className={paymentMethod === 'virtual_account' ? 'text-acid' : 'text-zinc-500'} />
                      <div>
                        <div className="text-sm font-bold text-white">BCA / Mandiri / BNI Virtual Account</div>
                        <div className="text-[11px] font-mono text-zinc-400">Transfer ATM & Mobile Banking</div>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center p-0.5">
                      {paymentMethod === 'virtual_account' && <span className="w-full h-full bg-acid rounded-full" />}
                    </span>
                  </div>
                </div>

                {/* Simulated Payment Box */}
                {paymentMethod === 'virtual_account' ? (
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                    <div className="text-xs text-zinc-400 font-mono">Nomor Virtual Account (BCA):</div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-sm text-white font-bold">
                      <span className="tracking-wider">8801928374619283</span>
                      <button
                        onClick={handleCopyVa}
                        className="text-xs text-acid hover:underline flex items-center gap-1 btn-tactile cursor-pointer"
                      >
                        {copiedVa ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedVa ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10 text-center space-y-2">
                    <div className="inline-block p-2.5 bg-white rounded-xl shadow-md">
                      <div className="w-28 h-28 bg-[#111319] rounded-lg flex items-center justify-center text-acid text-xs font-mono font-bold border border-black/10">
                        [QRIS SCAN]
                      </div>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-400">
                      Scan QRIS melalui aplikasi e-wallet atau mobile banking Anda.
                    </p>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex-1 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 font-mono text-xs uppercase btn-tactile flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleProcessPayment}
                    className="flex-[2] py-3.5 rounded-xl bg-acid text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-acid/20 btn-tactile hover:brightness-105 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isProcessing ? 'Menyimpan ke Database...' : 'Bayar Sekarang'}</span>
                    <ArrowRight size={14} weight="bold" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS & TICKET QR CODE */}
            {step === 'success' && createdOrder && (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} weight="fill" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white font-display">Pesanan Berhasil Disimpan ke Database!</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    Kode Pesanan: <span className="text-acid font-bold">{createdOrder.order_code}</span>
                  </p>
                </div>

                {/* E-Ticket Pass Preview */}
                <div className="bg-[#171a24] border border-white/10 rounded-2xl p-5 text-left space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <div className="text-[10px] font-mono text-acid font-bold uppercase tracking-wider">AURORA PULSE 2026</div>
                      <div className="text-sm font-bold text-white font-display">{tier.name}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                      ACTIVE
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1 text-xs font-mono text-zinc-400">
                      <div>Pemilik: <span className="text-white font-bold">{createdOrder.customer_name}</span></div>
                      <div>Venue: <span className="text-white">Stadion Madya GBK</span></div>
                      <div>Tanggal: <span className="text-white">18-20 Okt 2026</span></div>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-2 rounded-xl shadow-md shrink-0">
                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="QR Code" className="w-24 h-24 object-contain" />
                      ) : (
                        <div className="w-24 h-24 bg-zinc-200" />
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-mono">
                  E-Ticket ini otomatis tersimpan di menu <strong>"Tiket Saya"</strong> pada navigasi atas website.
                </p>

                <button
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-xl bg-acid text-black font-extrabold text-xs uppercase tracking-wider btn-tactile hover:brightness-105 cursor-pointer"
                >
                  Selesai & Buka Tiket Saya →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
