import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { eventController } from '../controllers/eventController.js';
import { ticketController } from '../controllers/ticketController.js';
import { orderController } from '../controllers/orderController.js';
import { artistController } from '../controllers/artistController.js';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth.js';

const router = Router();

// --- Health Check ---
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'Gelar Tikar API' });
});

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

// --- Event Routes ---
router.get('/events', eventController.getAll);
router.get('/events/:id', eventController.getById);
router.post('/events', adminOnlyMiddleware, eventController.create);
router.patch('/events/:id', adminOnlyMiddleware, eventController.update);
router.patch('/events/:id/toggle-sales', adminOnlyMiddleware, eventController.toggleSales);

// --- Ticket Tier Routes ---
router.get('/tickets', ticketController.getAll);
router.post('/tickets', adminOnlyMiddleware, ticketController.create);
router.patch('/tickets/:id', adminOnlyMiddleware, ticketController.update);
router.delete('/tickets/:id', adminOnlyMiddleware, ticketController.delete);

// --- Order Routes ---
// Pesan tiket wajib login supaya pesanan tercatat di akun pembeli.
router.post('/orders', authMiddleware, orderController.create);
router.get('/orders', authMiddleware, orderController.getMyOrders);
router.get('/orders/:code', authMiddleware, orderController.getByCode);

// --- Artist Routes ---
router.get('/artists', artistController.getAll);
router.post('/artists', adminOnlyMiddleware, artistController.create);
router.patch('/artists/:id', adminOnlyMiddleware, artistController.update);
router.delete('/artists/:id', adminOnlyMiddleware, artistController.delete);

// --- Admin Control Center Routes ---
router.get('/admin/dashboard', adminOnlyMiddleware, adminController.getDashboard);
router.get('/admin/orders', adminOnlyMiddleware, adminController.getAllOrders);
router.patch('/admin/orders/:id/verify', adminOnlyMiddleware, adminController.verifyOrder);

export default router;
