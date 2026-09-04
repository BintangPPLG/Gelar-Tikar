'use client';

import React, { useEffect, useState } from 'react';
import {
  Ticket,
  Plus,
  PencilSimple,
  Trash,
  CheckCircle,
  X,
  Check
} from '@phosphor-icons/react';

export default function AdminTicketsPage() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [formData, setFormData] = useState({
    event_id: 1,
    name: '',
    price: 1500000,
    total_quota: 500,
    description: '',
    perks_str: 'Fast-Track Entrance\nAkses VIP Lounge\nSmart RFID Wristband',
    status: 'active',
  });

  const fetchTiers = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success) {
        setTiers(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const openCreateModal = () => {
    setEditingTier(null);
    setFormData({
      event_id: 1,
      name: '',
      price: 1500000,
      total_quota: 500,
      description: '',
      perks_str: 'Fast-Track Entrance\nAkses Panggung Festival\nSmart RFID LED Wristband',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tier: any) => {
    setEditingTier(tier);
    const perksList = Array.isArray(tier.perks_json)
      ? tier.perks_json.join('\n')
      : typeof tier.perks_json === 'string'
      ? JSON.parse(tier.perks_json || '[]').join('\n')
      : '';

    setFormData({
      event_id: tier.event_id,
      name: tier.name,
      price: Number(tier.price),
      total_quota: Number(tier.total_quota),
      description: tier.description || '',
      perks_str: perksList,
      status: tier.status,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const perksArray = formData.perks_str.split('\n').map((s) => s.trim()).filter(Boolean);

    const payload = {
      event_id: Number(formData.event_id),
      name: formData.name,
      price: Number(formData.price),
      total_quota: Number(formData.total_quota),
      description: formData.description,
      perks_json: perksArray,
      status: formData.status,
    };

    try {
      if (editingTier) {
        await fetch(`/api/tickets/${editingTier.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      fetchTiers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori tiket ini?')) return;
    try {
      await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
      fetchTiers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display uppercase">
            Kategori Tiket & <span className="text-[#00f0ff]">Kuota</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Kelola kelas tiket (VIP, CAT 1, CAT 2, dll.), alokasi kuota penonton, serta fasilitas/perks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00f0ff] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#38bdf8] transition-all shadow-md shadow-[#00f0ff]/20 cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          <span>Tambah Kategori Tiket</span>
        </button>
      </div>

      {/* Tickets Table / Card Grid */}
      {loading ? (
        <div className="text-center py-12 text-zinc-400 font-mono text-sm">Memuat kategori tiket...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const perks = Array.isArray(tier.perks_json)
              ? tier.perks_json
              : typeof tier.perks_json === 'string'
              ? JSON.parse(tier.perks_json || '[]')
              : [];

            const pct = Math.round((tier.sold_count / tier.total_quota) * 100);

            return (
              <div
                key={tier.id}
                className="rounded-2xl glass-panel p-6 border border-white/15 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        tier.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {tier.status}
                    </span>
                    <Ticket size={18} className="text-[#00f0ff]" />
                  </div>

                  <h3 className="text-lg font-bold text-white font-display mb-1">{tier.name}</h3>
                  <div className="text-xl font-black text-[#00f0ff] font-mono-num mb-3">
                    IDR {Number(tier.price).toLocaleString('id-ID')}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{tier.description}</p>

                  {/* Quota Progress */}
                  <div className="mb-4 bg-black/40 p-3 rounded-xl border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span>Terjual:</span>
                      <span className="font-bold text-white">{tier.sold_count} / {tier.total_quota} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#ff2a6d]" style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>

                  {/* Perks */}
                  <div className="space-y-1.5 mb-6 text-xs text-zinc-300">
                    {perks.slice(0, 3).map((perk: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle size={14} weight="fill" className="text-[#00f0ff] shrink-0" />
                        <span className="truncate">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => openEditModal(tier)}
                    className="p-2 rounded-lg glass-pill text-zinc-300 hover:text-white"
                    title="Edit Kategori"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tier.id)}
                    className="p-2 rounded-lg glass-pill text-red-400 hover:bg-red-500/20"
                    title="Hapus Kategori"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create / Edit Tier */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c0e17] border border-white/15 rounded-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white font-display">
                {editingTier ? 'Edit Kategori Tiket' : 'Tambah Kategori Tiket Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Nama Kategori Tiket *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: VIP Cosmic Pass"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Harga Tiket (IDR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="10000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Total Kuota Tiket *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.total_quota}
                    onChange={(e) => setFormData({ ...formData, total_quota: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Status Kategori</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="active">Active (Tersedia untuk dibeli)</option>
                  <option value="closed">Closed (Ditutup)</option>
                  <option value="sold_out">Sold Out (Habis)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kenyamanan tempat duduk beratap dengan pandangan luas..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  Fasilitas / Perks (1 baris per fasilitas)
                </label>
                <textarea
                  rows={3}
                  value={formData.perks_str}
                  onChange={(e) => setFormData({ ...formData, perks_str: e.target.value })}
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
                  <span>Simpan Kategori</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
