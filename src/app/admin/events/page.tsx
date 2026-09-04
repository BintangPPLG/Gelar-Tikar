'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Plus,
  PencilSimple,
  Trash,
  MapPin,
  Lock,
  LockOpen,
  X,
  Check
} from '@phosphor-icons/react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    banner_url: '/assets/hero_stage.jpg',
    venue_name: '',
    venue_address: '',
    event_date: '',
    status: 'open',
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      banner_url: '/assets/hero_stage.jpg',
      venue_name: '',
      venue_address: '',
      event_date: new Date().toISOString().slice(0, 16),
      status: 'open',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description,
      banner_url: event.banner_url,
      venue_name: event.venue_name,
      venue_address: event.venue_address,
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
      status: event.status,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konser ini?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await fetch(`/api/admin/events/${id}/toggle-sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchEvents();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display uppercase">
            Kelola Event & <span className="text-[#00f0ff]">Konser</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Tambah jadwal konser baru, atur informasi venue, serta buka/tutup penjualan tiket.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#38bdf8] transition-all shadow-md shadow-[#00f0ff]/20 cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          <span>Tambah Konser Baru</span>
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-12 text-zinc-400 font-mono text-sm">Memuat daftar konser...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl glass-panel border border-white/15 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 w-full">
                <img
                  src={event.banner_url || '/assets/hero_stage.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover brightness-80"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                      event.status === 'open'
                        ? 'bg-emerald-500/90 text-black'
                        : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {event.status === 'open' ? 'TIKET DIBUKA' : 'TIKET DITUTUP'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white font-display mb-2">{event.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-xs text-zinc-300 mb-6 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#00f0ff]" />
                      <span>{new Date(event.event_date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#ff2a6d]" />
                      <span className="truncate">{event.venue_name} - {event.venue_address}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleToggleStatus(event.id, event.status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-colors ${
                      event.status === 'open'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    {event.status === 'open' ? <Lock size={14} /> : <LockOpen size={14} />}
                    <span>{event.status === 'open' ? 'Tutup Penjualan' : 'Buka Penjualan'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 rounded-lg glass-pill text-zinc-300 hover:text-white hover:bg-white/15"
                      title="Edit Konser"
                    >
                      <PencilSimple size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 rounded-lg glass-pill text-red-400 hover:bg-red-500/20"
                      title="Hapus Konser"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create / Edit Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0c0e17] border border-white/15 rounded-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white font-display">
                {editingEvent ? 'Edit Event Konser' : 'Tambah Event Konser Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Judul Konser *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setFormData({ ...formData, title, slug: formData.slug || slug });
                  }}
                  placeholder="Contoh: AURORA PULSE: WORLD TOUR 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Status Penjualan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="open">Open (Dibuka)</option>
                    <option value="closed">Closed (Ditutup)</option>
                    <option value="sold_out">Sold Out (Habis)</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Deskripsi Konser *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi detail konser, pengisi acara, dan teknologi audio..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Nama Venue *</label>
                  <input
                    type="text"
                    required
                    value={formData.venue_name}
                    onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                    placeholder="Stadion Madya GBK"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Tanggal Konser *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Alamat Lengkap Venue *</label>
                <input
                  type="text"
                  required
                  value={formData.venue_address}
                  onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
                  placeholder="Jl. Gerbang Pemuda No.3, Gelora, Jakarta Pusat"
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
                  <span>Simpan Konser</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
