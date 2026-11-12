import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SpeakerHigh, Play, ArrowRight } from '@phosphor-icons/react';
import { playIntroSonicBoom, playClickBeep } from '../audio/synthAudio';

interface WelcomeIntroProps {
  onEnter: () => void;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.025;
      ctx.fillStyle = 'rgba(8, 9, 12, 0.28)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const numRings = 4;

      for (let i = 0; i < numRings; i++) {
        const radius = Math.sin(time + i * 0.7) * 35 + 110 + i * 65;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(10, radius), 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 
          ? `rgba(212, 255, 0, ${0.12 + (i * 0.03)})` 
          : `rgba(255, 255, 255, ${0.06 + (i * 0.02)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (let p = 0; p < 20; p++) {
        const angle = p * (Math.PI * 2 / 20) + time * 0.35;
        const dist = 160 + Math.sin(time * 1.8 + p) * 50;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;

        ctx.fillStyle = p % 2 === 0 ? 'rgba(212, 255, 0, 0.7)' : 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(interval);
    };
  }, []);

  const handleStart = () => {
    playIntroSonicBoom();
    onEnter();
  };

  const handleSkip = () => {
    playClickBeep();
    onEnter();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.03,
        transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090c] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80" />

      {/* Modern subtle architectural grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '56px 56px'
        }}
      />

      <div className="relative z-10 max-w-lg w-full mx-4 text-center px-7 py-12 rounded-3xl bg-[#111319]/90 border border-white/10 shadow-2xl shadow-black">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-widest text-zinc-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-acid" />
          <span>JAKARTA 18-20 OKTOBER 2026</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase text-white font-display mb-3">
          AURORA<span className="text-acid">PULSE</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-sm mx-auto mb-8 leading-relaxed">
          Panggung audio visual 360° spatial sound bersertifikasi Dolby Live di Stadion Madya GBK.
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto mb-8">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5">
              <SpeakerHigh size={14} className="text-acid" />
              Dolby Spatial Engine
            </span>
            <span className="text-acid font-bold font-mono-num">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden p-0.5">
            <motion.div 
              className="h-full bg-acid rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleStart}
            disabled={!ready}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all btn-tactile ${
              ready 
                ? 'bg-acid text-black shadow-lg shadow-acid/20 hover:brightness-105 cursor-pointer' 
                : 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed'
            }`}
          >
            <Play size={16} weight="fill" />
            <span>MASUK KE FESTIVAL</span>
            <ArrowRight size={14} weight="bold" />
          </button>

          <button
            onClick={handleSkip}
            className="w-full sm:w-auto text-xs text-zinc-400 hover:text-white px-4 py-2.5 font-mono btn-tactile cursor-pointer"
          >
            Lewati Intro
          </button>
        </div>
      </div>
    </motion.div>
  );
};
