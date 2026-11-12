import { Request, Response } from 'express';
import { dbRepository, OrderError } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const adminController = {
  // GET /api/admin/dashboard
  async getDashboard(req: Request, res: Response) {
    try {
      const metrics = await dbRepository.getDashboardMetrics();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      console.error('[Admin Dashboard Error]:', error);
      res.status(500).json({ success: false, message: 'Gagal memuat metrik dashboard admin.' });
    }
  },

  // GET /api/admin/orders
  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await dbRepository.getAllOrders();
      res.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memuat daftar pesanan admin.' });
    }
  },

  // PATCH /api/admin/orders/:id/verify
  async verifyOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body; // 'verified' | 'rejected'

      if (!status || !['verified', 'rejected'].includes(status)) {
        res.status(400).json({ success: false, message: 'Status verifikasi harus "verified" atau "rejected".' });
        return;
      }

      const order = await dbRepository.verifyPayment(id, status, req.user?.userId);
      if (!order) {
        res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
        return;
      }

      res.json({
        success: true,
        message: status === 'verified' ? 'Pembayaran disetujui. E-tiket pembeli sekarang aktif.' : 'Pembayaran ditolak. Kuota tiket dikembalikan.',
        data: order,
      });
    } catch (error: any) {
      if (error instanceof OrderError) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Gagal memproses verifikasi pesanan.' });
    }
  },
};
