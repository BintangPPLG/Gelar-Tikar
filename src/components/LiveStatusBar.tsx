import React, { useState, useEffect } from 'react';
import { Timer, Fire, Users } from '@phosphor-icons/react';

export const LiveStatusBar: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 36,
    seconds: 20,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 42);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-16">
      <div className="rounded-2xl glass-panel p-4 sm:p-6 border border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
        {/* Countdown Timer */}
        <div className="flex items-center gap-4 pt-2 md:pt-0">
          <div className="w-11 h-11 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0">
            <Timer size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
              Menuju Pintu Gerbang
            </div>
            <div className="flex items-center gap-2 font-mono-num font-bold text-lg text-white">
              <span>{String(timeLeft.days).padStart(2, '0')}<span className="text-xs text-zinc-500 font-normal">h</span></span>
              <span className="text-[#00f0ff]">:</span>
              <span>{String(timeLeft.hours).padStart(2, '0')}<span className="text-xs text-zinc-500 font-normal">j</span></span>
              <span className="text-[#00f0ff]">:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}<span className="text-xs text-zinc-500 font-normal">m</span></span>
              <span className="text-[#00f0ff]">:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}<span className="text-xs text-zinc-500 font-normal">d</span></span>
            </div>
          </div>
        </div>

        {/* Live Ticket Demand */}
        <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6">
          <div className="w-11 h-11 rounded-xl bg-[#ff2a6d]/10 border border-[#ff2a6d]/30 flex items-center justify-center text-[#ff2a6d] shrink-0">
            <Fire size={24} weight="duotone" />
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-zinc-400">KUOTA PRESALE 2</span>
              <span className="text-[#ff2a6d] font-bold">92% Terisi</span>
            </div>
            <div className="h-2 w-full bg-zinc-800/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#ff2a6d] to-[#ff9f1c] w-[92%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Verified Community Attendee Count */}
        <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6">
          <div className="w-11 h-11 rounded-xl bg-[#ff9f1c]/10 border border-[#ff9f1c]/30 flex items-center justify-center text-[#ff9f1c] shrink-0">
            <Users size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
              Antusiasme Penonton
            </div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono-num">28.450+</span>
              <span className="text-xs font-normal text-zinc-400">Tiket Terverifikasi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
