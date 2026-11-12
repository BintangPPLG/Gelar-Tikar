import { Request, Response } from 'express';
import { dbRepository, OrderError } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const orderController = {
  // POST /api/orders
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { event_id, customer_name, customer_email, customer_phone, customer_id_card, tier_id, quantity, payment_method } = req.body;

      if (!event_id || !customer_name || !customer_email || !customer_phone || !tier_id || !quantity || !payment_method) {
        res.status(400).json({ success: false, message: 'Data pesanan tidak lengkap.' });
        return;
      }

      if (!['qris', 'virtual_account'].includes(payment_method)) {
        res.status(400).json({ success: false, message: 'Metode pembayaran harus QRIS atau Virtual Account.' });
        return;
      }

      const userId = req.user?.userId || null;

      const order = await dbRepository.createOrder({
        user_id: userId,
        event_id: Number(event_id),
        customer_name,
        customer_email,
        customer_phone,
        customer_id_card: customer_id_card || '',
        tier_id: Number(tier_id),
        quantity: Number(quantity),
        payment_method,
      });

      res.status(201).json({
        success: true,
        message: 'Pesanan dibuat. Selesaikan pembayaran, lalu tunggu verifikasi panitia.',
        data: order,
      });
    } catch (error: any) {
      if (error instanceof OrderError) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      console.error('[Create Order Error]:', error);
      res.status(500).json({ success: false, message: 'Gagal membuat pesanan tiket.' });
    }
  },

  // GET /api/orders (My Orders or Filtered by Email)
  async getMyOrders(req: AuthenticatedRequest, res: Response) {
    try {
      // Hanya pesanan milik akun yang sedang login.
      const userId = req.user?.userId || null;
      const email = req.user?.email || '';

      const orders = await dbRepository.getOrdersByUserOrEmail(userId, email);
      res.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pesanan.' });
    }
  },

  // GET /api/orders/:code
  async getByCode(req: AuthenticatedRequest, res: Response) {
    try {
      const code = String(req.params.code);
      const order = await dbRepository.getOrderByCode(code);
      const isOwner = order && (order.user_id === req.user?.userId || order.customer_email === req.user?.email);
      if (!order || (!isOwner && req.user?.role !== 'admin')) {
        res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
        return;
      }
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memuat detail pesanan.' });
    }
  },
};
