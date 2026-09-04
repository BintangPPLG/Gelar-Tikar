'use client';

import React, { useEffect, useState } from 'react';
import {
  UsersThree,
  Plus,
  PencilSimple,
  Trash,
  MusicNotes,
  X,
  Check
} from '@phosphor-icons/react';

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    bio: '',
    image_url: '/assets/artist_headliner.jpg',
    spotify_url: '',
    instagram_url: '',
  });

  const fetchArtists = async () => {
    try {
      const res = await fetch('/api/artists');
      const data = await res.json();
      if (data.success) {
        setArtists(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const openCreateModal = () => {
    setEditingArtist(null);
    setFormData({
      name: '',
      genre: '',
      bio: '',
      image_url: '/assets/artist_headliner.jpg',
      spotify_url: 'https://spotify.com',
      instagram_url: 'https://instagram.com',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (artist: any) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      genre: artist.genre,
      bio: artist.bio || '',
      image_url: artist.image_url || '/assets/artist_headliner.jpg',
      spotify_url: artist.spotify_url || '',
      instagram_url: artist.instagram_url || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingArtist) {
        await fetch(`/api/artists/${editingArtist.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/artists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setIsModalOpen(false);
      fetchArtists();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data artis ini?')) return;
    try {
      await fetch(`/api/artists/${id}`, { method: 'DELETE' });
      fetchArtists();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display uppercase">
            Penyanyi & <span className="text-[#00f0ff]">Artis Festival</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Kelola profil penampil, genre musik, foto panggung, dan tautan sosial media artis.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#38bdf8] transition-all shadow-md shadow-[#00f0ff]/20 cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          <span>Tambah Artis Baru</span>
        </button>
      </div>

      {/* Artists Grid */}
      {loading ? (
        <div className="text-center py-12 text-zinc-400 font-mono text-sm">Memuat daftar artis...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="rounded-2xl glass-panel p-5 border border-white/15 flex flex-col justify-between"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/15">
                  <img
                    src={artist.image_url || '/assets/artist_headliner.jpg'}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5 text-xs text-[#00f0ff] font-mono mb-0.5">
                    <MusicNotes size={14} />
                    <span className="truncate">{artist.genre}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display truncate">{artist.name}</h3>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                {artist.bio || 'Musisi resmi yang akan tampil di panggung festival spektakuler.'}
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => openEditModal(artist)}
                  className="p-2 rounded-lg glass-pill text-zinc-300 hover:text-white"
                  title="Edit Artis"
                >
                  <PencilSimple size={16} />
                </button>
                <button
                  onClick={() => handleDelete(artist.id)}
                  className="p-2 rounded-lg glass-pill text-red-400 hover:bg-red-500/20"
                  title="Hapus Artis"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create / Edit Artist */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c0e17] border border-white/15 rounded-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white font-display">
                {editingArtist ? 'Edit Data Artis' : 'Tambah Artis Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Nama Artis / Band *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Cyber Nexus"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Genre Musik *</label>
                <input
                  type="text"
                  required
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="Contoh: Progressive Synthwave / Melodic House"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">URL Foto Artis</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Biografi Singkat</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Informasi latar belakang artis, prestasi, dan diskografi..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl glass-pill text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#38bdf8] flex items-center gap-1.5"
                >
                  <Check size={16} weight="bold" />
                  <span>Simpan Artis</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
