import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SpeakerHigh, Play, ArrowRight, Sparkle } from '@phosphor-icons/react';
import { playIntroSonicBoom, playClickBeep } from '../audio/synthAudio';

interface WelcomeIntroProps {
  onEnter: () => void;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Animated canvas frequency pulses
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
      time += 0.03;
      ctx.fillStyle = 'rgba(8, 9, 13, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const numRings = 5;

      for (let i = 0; i < numRings; i++) {
        const radius = (Math.sin(time + i * 0.7) * 40 + 120 + i * 70);
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(10, radius), 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 === 0 
          ? `rgba(0, 240, 255, ${0.15 + (i * 0.05)})` 
          : `rgba(255, 42, 109, ${0.12 + (i * 0.04)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Small floating particle sparks
      for (let p = 0; p < 24; p++) {
        const angle = p * (Math.PI * 2 / 24) + time * 0.4;
        const dist = 180 + Math.sin(time * 2 + p) * 60;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;

        ctx.fillStyle = p % 2 === 0 ? '#00f0ff' : '#ff9f1c';
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Simulated frequency sync loader
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

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
        scale: 1.05,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090d] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80" />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative z-10 max-w-xl w-full mx-4 text-center px-6 py-10 rounded-2xl glass-panel border border-white/10 shadow-2xl">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono tracking-widest text-[#00f0ff] mb-6"
        >
          <Sparkle size={14} weight="fill" />
          <span>JAKARTA EDITION - 18-20 OKT 2026</span>
        </motion.div>

        {/* Big Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase text-white font-display mb-3"
        >
          AURORA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff2a6d] to-[#ff9f1c]">PULSE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-base text-zinc-400 font-sans max-w-md mx-auto mb-8"
        >
          Panggung konser audio visual 360 derajat pertama di Asia Tenggara. Siapkan diri anda untuk pengalaman sonik tanpa batas.
        </motion.p>

        {/* Frequency & Progress Bar */}
        <div className="w-full max-w-xs mx-auto mb-8">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5">
              <SpeakerHigh size={14} className="text-[#00f0ff]" />
              Audio Engine
            </span>
            <span className="text-[#00f0ff] font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#00f0ff] to-[#ff2a6d]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            disabled={!ready}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg ${
              ready 
                ? 'bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black hover:shadow-[#00f0ff]/30 hover:shadow-xl cursor-pointer' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Play size={18} weight="fill" />
            <span>MASUK KE FESTIVAL</span>
            <ArrowRight size={16} weight="bold" />
          </motion.button>

          <button
            onClick={handleSkip}
            className="w-full sm:w-auto text-xs text-zinc-400 hover:text-white px-4 py-2 font-mono transition-colors cursor-pointer"
          >
            Lewati Intro
          </button>
        </div>
      </div>
    </motion.div>
  );
};
