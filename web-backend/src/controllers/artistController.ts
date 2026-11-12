import { Request, Response } from 'express';
import { dbRepository } from '../services/store.js';

export const artistController = {
  // GET /api/artists
  async getAll(req: Request, res: Response) {
    try {
      const artists = await dbRepository.getAllArtists();
      res.json({ success: true, count: artists.length, data: artists });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memuat daftar artis.' });
    }
  },

  // POST /api/artists (Admin Only)
  async create(req: Request, res: Response) {
    try {
      const { name, genre, bio, image_url, spotify_url, instagram_url } = req.body;
      if (!name || !genre) {
        res.status(400).json({ success: false, message: 'Nama dan genre artis wajib diisi.' });
        return;
      }
      const newArtist = await dbRepository.createArtist({
        name,
        genre,
        bio: bio || '',
        image_url: image_url || '/assets/artist_headliner.jpg',
        spotify_url: spotify_url || 'https://spotify.com',
        instagram_url: instagram_url || 'https://instagram.com',
      });
      res.status(201).json({ success: true, message: 'Artis berhasil ditambahkan.', data: newArtist });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal menambahkan artis.' });
    }
  },

  // PATCH /api/artists/:id (Admin Only)
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await dbRepository.updateArtist(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Artis tidak ditemukan.' });
        return;
      }
      res.json({ success: true, message: 'Artis berhasil diperbarui.', data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memperbarui data artis.' });
    }
  },

  // DELETE /api/artists/:id
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await dbRepository.deleteArtist(id);
      res.json({ success: true, message: 'Artis berhasil dihapus.' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal menghapus artis.' });
    }
  },
};
