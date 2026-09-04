import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle, 
  QrCode, 
  CreditCard, 
  Bank, 
  ShieldCheck, 
  Ticket, 
  DownloadSimple, 
  Copy,
  Check
} from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import type { TicketTier } from './TicketPassSelector';
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
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'card'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedVa, setCopiedVa] = useState(false);

  if (!isOpen || !tier) return null;

  const totalPrice = tier.price * quantity;
  const adminFee = 25000;
  const grandTotal = totalPrice + adminFee;
  const ticketId = `AP26-${tier.id.toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    playClickBeep();
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Mohon lengkapi data pemesan tiket.');
      return;
    }
    setStep('payment');
  };

  const handleProcessPayment = () => {
    playClickBeep();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      playSuccessChime();

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ff2a6d', '#ff9f1c', '#ffffff'],
        });
      } catch {
        // confetti fallback
      }
    }, 1500);
  };

  const handleCopyVa = () => {
    navigator.clipboard.writeText('8801928374619283');
    setCopiedVa(true);
    playClickBeep();
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handleDownloadTicket = () => {
    playClickBeep();
    alert(`E-Ticket ${ticketId} berhasil diunduh ke perangkat Anda!`);
  };

  const handleClose = () => {
    playClickBeep();
    setStep('form');
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl bg-[#0c0e17] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                <Ticket size={18} weight="fill" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {step === 'success' ? 'E-Ticket Resmi Terbit' : 'Pemesanan Tiket Resmi'}
                </h3>
                <span className="text-xs text-zinc-400 font-mono">
                  {tier.name} • {quantity} Tiket
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
            {step === 'form' && (
              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* Order Summary Pill */}
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block font-mono">KATEGORI TERPILIH</span>
                    <span className="text-base font-bold text-white">{tier.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block font-mono">TOTAL PEMBAYARAN</span>
                    <span className="text-base font-extrabold text-[#00f0ff] font-mono-num">
                      IDR {grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                      Nama Lengkap (Sesuai KTP / Paspor) *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Contoh: Raditya Pratama"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                        Alamat Email Aktif *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="nama@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="081234567890"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                      Nomor NIK / Paspor (Untuk Verifikasi Gelang)
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      placeholder="3171xxxxxxxxxxxx"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-extrabold text-sm uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#00f0ff]/25 cursor-pointer"
                >
                  Lanjut ke Pembayaran
                </button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                {/* Price Breakdown */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>{tier.name} ({quantity}x)</span>
                    <span className="font-mono-num text-white">IDR {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Biaya Layanan & Pajak Hiburan</span>
                    <span className="font-mono-num text-white">IDR {adminFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                    <span>Grand Total:</span>
                    <span className="text-[#00f0ff] font-mono-num">
                      IDR {grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                    Pilih Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'qris', label: 'QRIS', icon: QrCode },
                      { id: 'va', label: 'Virtual Account', icon: Bank },
                      { id: 'card', label: 'Kartu Kredit', icon: CreditCard },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => {
                            playClickBeep();
                            setPaymentMethod(method.id as 'qris' | 'va' | 'card');
                          }}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]'
                              : 'border-white/10 bg-zinc-900/50 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Icon size={24} weight="duotone" />
                          <span className="text-xs font-semibold">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method Content */}
                {paymentMethod === 'qris' && (
                  <div className="p-6 rounded-xl bg-white text-black flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold tracking-widest text-zinc-700 uppercase mb-2">
                      Scan QRIS Menggunakan E-Wallet / M-Banking
                    </span>
                    {/* Simulated QR barcode pattern */}
                    <div className="w-44 h-44 border-4 border-black p-2 bg-white flex items-center justify-center my-2 shadow-inner">
                      <QrCode size={140} className="text-black" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-600 mt-1">
                      NMID: ID1029384756 • AURORA PULSE FESTIVAL
                    </span>
                  </div>
                )}

                {paymentMethod === 'va' && (
                  <div className="p-5 rounded-xl bg-black/50 border border-white/10 space-y-3">
                    <div className="text-xs text-zinc-400">Nomor Virtual Account BCA:</div>
                    <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-lg border border-white/10">
                      <span className="font-mono text-base font-bold text-white tracking-widest">
                        8801 9283 7461 9283
                      </span>
                      <button
                        onClick={handleCopyVa}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/30 text-xs font-mono transition-colors cursor-pointer"
                      >
                        {copiedVa ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedVa ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Sistem akan memverifikasi pembayaran Anda secara otomatis dalam waktu 5 detik.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nomor Kartu (4000 1234 5678 9010)"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff]"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playClickBeep();
                      setStep('form');
                    }}
                    className="w-1/3 py-3.5 rounded-xl glass-pill text-xs font-bold text-zinc-300 hover:text-white cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00f0ff]/25 cursor-pointer"
                  >
                    {isProcessing ? (
                      <span className="inline-block animate-pulse">Memproses Pembayaran...</span>
                    ) : (
                      <span>Konfirmasi & Bayar</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-6 text-center">
                {/* Success Icon Badge */}
                <div className="w-14 h-14 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] flex items-center justify-center mx-auto shadow-xl shadow-[#00f0ff]/30">
                  <CheckCircle size={32} weight="fill" />
                </div>

                <div>
                  <h4 className="text-2xl font-extrabold text-white font-display uppercase mb-1">
                    Pembayaran Berhasil!
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Tiket resmi Anda telah terverifikasi di sistem blockchain festival.
                  </p>
                </div>

                {/* Digital Holographic E-Ticket Pass Card */}
                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#121624] to-[#08090d] border border-[#00f0ff]/40 shadow-2xl relative overflow-hidden text-left">
                  {/* Sheen effect */}
                  <div className="absolute inset-0 holographic-sheen opacity-10 pointer-events-none" />

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#00f0ff] block">E-TICKET RESMI</span>
                        <span className="text-sm font-extrabold text-white font-display">AURORA PULSE 2026</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 text-[10px] font-mono font-bold">
                        {ticketId}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-zinc-500 block font-mono">PEMEGANG TIKET</span>
                        <span className="font-bold text-white">{formData.fullName || 'Raditya Pratama'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block font-mono">KATEGORI</span>
                        <span className="font-bold text-[#00f0ff]">{tier.name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block font-mono">TANGGAL & VENUE</span>
                        <span className="font-bold text-white">18-20 Okt 2026 • GBK Jakarta</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block font-mono">JUMLAH</span>
                        <span className="font-bold text-white">{quantity} Pass</span>
                      </div>
                    </div>

                    {/* QR Code and Barcode Footer */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <QrCode size={38} className="text-white" />
                        <div className="text-[10px] font-mono leading-tight">
                          <span>Scan di Gerbang Masuk</span>
                          <span className="block text-zinc-500">Fast Track Active</span>
                        </div>
                      </div>
                      <ShieldCheck size={28} weight="fill" className="text-[#00f0ff]" />
                    </div>
                  </div>
                </div>

                {/* Download and Done button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleDownloadTicket}
                    className="w-full sm:w-1/2 py-3.5 rounded-xl glass-pill text-xs font-bold text-white hover:bg-white/15 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <DownloadSimple size={16} weight="bold" />
                    <span>Unduh E-Ticket (PDF)</span>
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full sm:w-1/2 py-3.5 rounded-xl bg-[#00f0ff] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#38bdf8] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Selesai</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
