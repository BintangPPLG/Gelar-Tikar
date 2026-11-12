import { Request, Response } from 'express';
import { dbRepository } from '../services/store.js';

export const ticketController = {
  // GET /api/tickets?event_id=1
  async getAll(req: Request, res: Response) {
    try {
      const eventId = req.query.event_id ? Number(req.query.event_id) : undefined;
      const tiers = eventId ? await dbRepository.getTiersByEventId(eventId) : await dbRepository.getAllTiers();
      res.json({ success: true, data: tiers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memuat kategori tiket.' });
    }
  },

  // POST /api/tickets (Admin Only)
  async create(req: Request, res: Response) {
    try {
      const { event_id, name, price, total_quota, description, perks_json, status } = req.body;
      if (!event_id || !name || !price || !total_quota) {
        res.status(400).json({ success: false, message: 'Data kategori tiket tidak lengkap.' });
        return;
      }
      const newTier = await dbRepository.createTier({
        event_id: Number(event_id),
        name,
        price: Number(price),
        total_quota: Number(total_quota),
        description: description || '',
        perks_json: perks_json || [],
        status: status || 'active',
      });
      res.status(201).json({ success: true, message: 'Kategori tiket berhasil ditambahkan.', data: newTier });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal membuat kategori tiket.' });
    }
  },

  // PATCH /api/tickets/:id (Admin Only)
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await dbRepository.updateTier(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Kategori tiket tidak ditemukan.' });
        return;
      }
      res.json({ success: true, message: 'Kategori tiket berhasil diperbarui.', data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memperbarui tiket.' });
    }
  },

  // DELETE /api/tickets/:id
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await dbRepository.deleteTier(id);
      res.json({ success: true, message: 'Kategori tiket berhasil dihapus.' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal menghapus tiket.' });
    }
  },
};
