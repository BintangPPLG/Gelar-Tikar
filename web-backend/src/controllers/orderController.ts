import { Request, Response } from 'express';
import { dbRepository } from '../services/store.js';
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
        message: 'Pesanan tiket berhasil dibuat! Silakan selesaikan pembayaran.',
        data: order,
      });
    } catch (error: any) {
      console.error('[Create Order Error]:', error);
      res.status(400).json({ success: false, message: error.message || 'Gagal membuat pesanan tiket.' });
    }
  },

  // GET /api/orders (My Orders or Filtered by Email)
  async getMyOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId || null;
      const email = (req.query.email as string) || (req.user?.email as string) || '';

      if (!userId && !email) {
        res.status(400).json({ success: false, message: 'Parameter email atau sesi login diperlukan.' });
        return;
      }

      const orders = await dbRepository.getOrdersByUserOrEmail(userId, email);
      res.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pesanan.' });
    }
  },

  // GET /api/orders/:code
  async getByCode(req: Request, res: Response) {
    try {
      const code = String(req.params.code);
      const order = await dbRepository.getOrderByCode(code);
      if (!order) {
        res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
        return;
      }
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Gagal memuat detail pesanan.' });
    }
  },
};
