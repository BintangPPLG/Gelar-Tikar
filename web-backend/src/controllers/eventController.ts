import { Request, Response } from 'express';
import { dbRepository } from '../services/store.js';

export const eventController = {
  // GET /api/events
  async getAll(req: Request, res: Response) {
    try {
      const events = await dbRepository.getAllEvents();
      res.json({ success: true, count: events.length, data: events });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memuat daftar event.' });
    }
  },

  // GET /api/events/:idOrSlug
  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const event = await dbRepository.getEventByIdOrSlug(id);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event tidak ditemukan.' });
        return;
      }
      res.json({ success: true, data: event });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memuat detail event.' });
    }
  },

  // POST /api/events (Admin Only)
  async create(req: Request, res: Response) {
    try {
      const eventData = req.body;
      if (!eventData.title || !eventData.venue_name || !eventData.event_date) {
        res.status(400).json({ success: false, message: 'Data event tidak lengkap.' });
        return;
      }
      const slug = eventData.slug || eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newEvent = await dbRepository.createEvent({
        ...eventData,
        slug,
        banner_url: eventData.banner_url || '/assets/hero_stage.jpg',
      });
      res.status(201).json({ success: true, message: 'Event berhasil ditambahkan.', data: newEvent });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal membuat event.' });
    }
  },

  // PATCH /api/events/:id
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await dbRepository.updateEvent(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Event tidak ditemukan.' });
        return;
      }
      res.json({ success: true, message: 'Event berhasil diperbarui.', data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memperbarui event.' });
    }
  },

  // PATCH /api/events/:id/toggle-sales
  async toggleSales(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const updated = await dbRepository.updateEvent(id, { status });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Event tidak ditemukan.' });
        return;
      }
      res.json({ success: true, message: `Status penjualan event berhasil diubah menjadi ${status}.`, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal mengubah status penjualan.' });
    }
  },
};
