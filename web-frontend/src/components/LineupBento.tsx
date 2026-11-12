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
      stage: 'Mainframe Arena',
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
      stage: 'Mainframe Arena',
      time: '18:00 WIB',
      image: '/assets/artist_headliner.jpg',
    },
  ],
  2: [
    {
      id: 'artist-5',
      name: 'AURA SPATIAL',
      genre: '3D Ambient House & Trance',
      stage: 'Mainframe Arena',
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
      stage: 'Mainframe Arena',
      time: '17:30 WIB',
      image: '/assets/hero_stage.jpg',
    },
  ],
  3: [
    {
      id: 'artist-3',
      name: 'GRAND RESOUND',
      genre: 'World Finale All-Star Set',
      stage: 'Mainframe Arena',
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
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display uppercase">
            Lineup <span className="text-acid">Musisi Dunia</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-lg">
            Jadwal penampilan langsung produser musik elektronik dan live vocalists di 3 panggung utama.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-[#111319] border border-white/10 self-start md:self-auto">
          {[
            { day: 1, label: 'Hari 1', date: '18 Okt' },
            { day: 2, label: 'Hari 2', date: '19 Okt' },
            { day: 3, label: 'Hari 3', date: '20 Okt' },
          ].map((item) => {
            const isActive = selectedDay === item.day;
            return (
              <button
                key={item.day}
                onClick={() => handleDayChange(item.day)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center btn-tactile cursor-pointer ${
                  isActive
                    ? 'bg-acid text-black shadow-md shadow-acid/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-zinc-800' : 'text-zinc-500'}`}>
                  {item.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Layout Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Spotlight Headliner Card */}
          <div className="lg:col-span-7 group relative rounded-3xl bg-[#111319] overflow-hidden border border-white/10 min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-7 sm:p-9 shadow-2xl">
            <img
              src={headliner.image}
              alt={headliner.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/60 to-transparent" />

            <div className="relative z-10 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-acid text-black text-[11px] font-bold font-mono uppercase tracking-wider">
                  HEADLINER UTAMA
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300">
                  {headliner.stage}
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase mb-2">
                {headliner.name}
              </h3>

              <p className="text-sm text-zinc-300 mb-6 font-medium">
                {headliner.genre} • Jam Tayang {headliner.time}
              </p>

              {/* Sound Preview Action */}
              <button
                onClick={() => handleTogglePlay(headliner.id)}
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs tracking-wider transition-all btn-tactile cursor-pointer ${
                  playingArtistId === headliner.id
                    ? 'bg-acid text-black shadow-lg shadow-acid/30'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
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

          {/* Supporting Artists Column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {otherArtists.map((artist) => (
              <div
                key={artist.id}
                className="group relative rounded-2xl bg-[#111319] p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-acid block mb-0.5 font-bold">
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
                  title="Dengarkan Sample Audio"
                  className={`p-3 rounded-xl shrink-0 transition-all btn-tactile cursor-pointer ${
                    playingArtistId === artist.id
                      ? 'bg-acid text-black shadow-md shadow-acid/30'
                      : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
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
