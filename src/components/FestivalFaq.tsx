import React, { useState } from 'react';
import { CaretDown, Question } from '@phosphor-icons/react';
import { playClickBeep } from '../audio/synthAudio';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Bagaimana cara menukarkan E-Ticket menjadi gelang RFID resmi?',
    answer: 'Penukaran e-ticket dapat dilakukan mulai H-3 festival di booth redemption Stadion Madya GBK atau langsung pada hari H di gerbang utama dengan menunjukkan barcode e-ticket dan kartu identitas fisik.',
  },
  {
    question: 'Berapa batas usia minimum untuk menghadiri konser ini?',
    answer: 'Acara ini terbuka untuk penonton berusia 16 tahun ke atas. Penonton di bawah 18 tahun wajib didampingi orang tua atau wali dewasa yang juga memiliki tiket resmi.',
  },
  {
    question: 'Apakah diperbolehkan membawa kamera profesional ke dalam venue?',
    answer: 'Kamera saku dan smartphone diperbolehkan. Kamera profesional tipe DSLR, mirrorless dengan lensa lepas-pasang, tongsis, dan drone dilarang masuk demi kenyamanan bersama.',
  },
  {
    question: 'Apakah tiket yang sudah dibeli dapat dipindahtangankan atau di-refund?',
    answer: 'Tiket bersifat non-refundable kecuali terjadi pembatalan resmi oleh pihak penyelenggara. Pemindahtanganan tiket wajib menyertakan surat kuasa bermaterai dan fotokopi KTP pembeli asli.',
  },
  {
    question: 'Bagaimana akses transportasi umum menuju Stadion Madya GBK?',
    answer: 'Lokasi sangat mudah dijangkau via MRT (Stasiun Istora Mandiri / Senayan) lalu berjalan kaki 7 menit melalui Pintu 5 GBK, atau menggunakan TransJakarta koridor 1 turun di Halte GBK.',
  },
  {
    question: 'Apakah tersedia fasilitas untuk penyandang disabilitas?',
    answer: 'Ya, kami menyediakan jalur khusus kursi roda, platform pandangan khusus (accessible viewing deck), toilet ramah difabel, dan tim medis pendamping terlatih.',
  },
];

export const FestivalFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    playClickBeep();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display uppercase">
          Pertanyaan <span className="text-[#00f0ff]">Umum (FAQ)</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Informasi penting mengenai panduan penukaran tiket, akses venue, dan peraturan festival.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl glass-panel border border-white/10 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                  <Question size={18} className="text-[#00f0ff] shrink-0" />
                  {faq.question}
                </span>
                <CaretDown
                  size={18}
                  className={`text-zinc-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#00f0ff]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
