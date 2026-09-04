import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Waves } from '@phosphor-icons/react';
import { toggleArtistAudioPreview, playClickBeep } from '../audio/synthAudio';

interface Artist {
  id: string;
  name: string;
  genre: string;
  stage: string;
  time: string;
  image: string;
  highlight?: boolean;
}

const lineupData: Record<number, Artist[]> = {
  1: [
    {
      id: 'artist-1',
      name: 'CYBER NEXUS',
      genre: 'Progressive Electro / Synthwave',
      stage: 'Aurora Mainframe Stage',
      time: '22:30 WIB',
      image: '/assets/artist_headliner.jpg',
      highlight: true,
    },
    {
      id: 'artist-2',
      name: 'STELLA VORTEX',
      genre: 'Melodic Techno & Live Vocals',
      stage: 'Cosmic Dome',
      time: '20:45 WIB',
      image: '/assets/festival_atmosphere.jpg',
    },
    {
      id: 'artist-3',
      name: 'KINETIC PULSE',
      genre: 'Analog Modular Live Set',
      stage: 'Neon Realm',
      time: '19:15 WIB',
      image: '/assets/hero_stage.jpg',
    },
    {
      id: 'artist-4',
      name: 'HYPERION ECHO',
      genre: 'Future Bass / Cinematic',
      stage: 'Aurora Mainframe Stage',
      time: '18:00 WIB',
      image: '/assets/artist_headliner.jpg',
    },
  ],
  2: [
    {
      id: 'artist-5',
      name: 'AURA SPATIAL',
      genre: '3D Ambient House & Trance',
      stage: 'Aurora Mainframe Stage',
      time: '22:00 WIB',
      image: '/assets/hero_stage.jpg',
      highlight: true,
    },
    {
      id: 'artist-6',
      name: 'NEO VALKYRIE',
      genre: 'Cyberpunk Drum & Bass',
      stage: 'Cosmic Dome',
      time: '20:30 WIB',
      image: '/assets/artist_headliner.jpg',
    },
    {
      id: 'artist-2',
      name: 'SYNTH HARMONIX',
      genre: 'French Touch Electro',
      stage: 'Neon Realm',
      time: '19:00 WIB',
      image: '/assets/festival_atmosphere.jpg',
    },
    {
      id: 'artist-3',
      name: 'LUMINA ORCHESTRA',
      genre: 'Orchestral Electronic Fusion',
      stage: 'Aurora Mainframe Stage',
      time: '17:30 WIB',
      image: '/assets/hero_stage.jpg',
    },
  ],
  3: [
    {
      id: 'artist-3',
      name: 'GRAND RESOUND',
      genre: 'World Finale All-Star Set',
      stage: 'Aurora Mainframe Stage',
      time: '22:15 WIB',
      image: '/assets/festival_atmosphere.jpg',
      highlight: true,
    },
    {
      id: 'artist-1',
      name: 'QUANTUM DRIFT',
      genre: 'Acid House & Live Lasers',
      stage: 'Cosmic Dome',
      time: '20:15 WIB',
      image: '/assets/artist_headliner.jpg',
    },
    {
      id: 'artist-4',
      name: 'ECHO DISTRICT',
      genre: 'Indie Electro Pop',
      stage: 'Neon Realm',
      time: '18:45 WIB',
      image: '/assets/hero_stage.jpg',
    },
    {
      id: 'artist-6',
      name: 'SOLARIS DUSK',
      genre: 'Deep Melodic House',
      stage: 'Cosmic Dome',
      time: '17:00 WIB',
      image: '/assets/festival_atmosphere.jpg',
    },
  ],
};

export const LineupBento: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [playingArtistId, setPlayingArtistId] = useState<string | null>(null);

  const handleDayChange = (day: number) => {
    playClickBeep();
    setSelectedDay(day);
  };

  const handleTogglePlay = (artistId: string) => {
    toggleArtistAudioPreview(artistId, (isPlaying, activeId) => {
      setPlayingArtistId(isPlaying ? activeId : null);
    });
  };

  const currentLineup = lineupData[selectedDay] || lineupData[1];
  const headliner = currentLineup.find((a) => a.highlight) || currentLineup[0];
  const otherArtists = currentLineup.filter((a) => a !== headliner);

  return (
    <section id="lineup" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display uppercase">
            Lineup <span className="text-[#00f0ff]">Musisi & Artis</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl">
            Kolaborasi spektakuler produser musik elektronik, komposer visual, dan live vocalists kelas dunia.
          </p>
        </div>

        {/* Day Selection Tabs */}
        <div className="inline-flex p-1.5 rounded-xl glass-panel border border-white/10 self-start md:self-auto">
          {[
            { day: 1, label: 'Hari 1', date: '18 Okt' },
            { day: 2, label: 'Hari 2', date: '19 Okt' },
            { day: 3, label: 'Hari 3', date: '20 Okt' },
          ].map((item) => (
            <button
              key={item.day}
              onClick={() => handleDayChange(item.day)}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex flex-col items-center cursor-pointer ${
                selectedDay === item.day
                  ? 'bg-[#00f0ff] text-black shadow-md shadow-[#00f0ff]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              <span className={`text-[10px] font-mono ${selectedDay === item.day ? 'text-zinc-900' : 'text-zinc-500'}`}>
                {item.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bento Layout Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Spotlight Headliner Card (7 Columns) */}
          <div className="lg:col-span-7 group relative rounded-2xl glass-panel overflow-hidden border border-white/15 min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-8">
            <img
              src={headliner.image}
              alt={headliner.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/60 to-transparent" />

            <div className="relative z-10 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-[#ff2a6d] text-white text-[11px] font-bold tracking-wider uppercase">
                  HEADLINER UTAMA
                </span>
                <span className="px-2.5 py-1 rounded-full glass-pill text-[11px] font-mono text-[#00f0ff]">
                  {headliner.stage}
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight uppercase mb-2">
                {headliner.name}
              </h3>

              <p className="text-sm text-zinc-300 mb-6 font-medium">
                {headliner.genre} • Jam Tayang {headliner.time}
              </p>

              {/* Live Audio Preview Trigger */}
              <button
                onClick={() => handleTogglePlay(headliner.id)}
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                  playingArtistId === headliner.id
                    ? 'bg-[#00f0ff] text-black shadow-lg shadow-[#00f0ff]/30'
                    : 'glass-pill text-white hover:bg-white/20'
                }`}
              >
                {playingArtistId === headliner.id ? (
                  <>
                    <Pause size={16} weight="fill" />
                    <span>HENTIKAN AUDIO</span>
                    <Waves size={16} className="animate-pulse" />
                  </>
                ) : (
                  <>
                    <Play size={16} weight="fill" />
                    <span>DENGARKAN SOUND PREVIEW</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Supporting Artists Grid (5 Columns) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {otherArtists.map((artist) => (
              <div
                key={artist.id}
                className="group relative rounded-xl glass-panel p-4 sm:p-5 border border-white/10 hover:border-white/25 transition-all duration-300 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/15">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#00f0ff] block mb-0.5">
                      {artist.stage} • {artist.time}
                    </span>
                    <h4 className="text-base font-bold text-white font-display">
                      {artist.name}
                    </h4>
                    <span className="text-xs text-zinc-400 line-clamp-1">
                      {artist.genre}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleTogglePlay(artist.id)}
                  title="Dengarkan Audio Sample"
                  className={`p-2.5 rounded-full shrink-0 transition-all duration-200 cursor-pointer ${
                    playingArtistId === artist.id
                      ? 'bg-[#00f0ff] text-black shadow-md shadow-[#00f0ff]/30'
                      : 'bg-white/10 text-white hover:bg-[#00f0ff] hover:text-black'
                  }`}
                >
                  {playingArtistId === artist.id ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
