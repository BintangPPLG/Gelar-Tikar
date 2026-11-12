import { Request, Response } from 'express';
import { dbRepository } from '../services/store.js';
import { hashPassword, comparePassword, generateToken, AuthenticatedRequest } from '../middleware/auth.js';

export const authController = {
  // POST /api/auth/register
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
        return;
      }

      const existingUser = await dbRepository.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ success: false, message: 'Email sudah terdaftar. Silakan login.' });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await dbRepository.createUser({
        name,
        email,
        password: hashedPassword,
        phone: phone || '',
        role: 'customer',
      });

      const token = generateToken({
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil! Selamat datang di Aurora Pulse.',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      });
    } catch (error: any) {
      console.error('[Register Error]:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat registrasi.' });
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
        return;
      }

      const user = await dbRepository.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, message: 'Email atau password salah.' });
        return;
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Email atau password salah.' });
        return;
      }

      const token = generateToken({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        message: `Login berhasil. Selamat datang kembali, ${user.name}!`,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error('[Login Error]:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login.' });
    }
  },

  // GET /api/auth/me
  async me(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Sesi tidak ditemukan.' });
        return;
      }

      const user = await dbRepository.getUserById(req.user.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error('[Me Error]:', error);
      res.status(500).json({ success: false, message: 'Gagal mengambil data user.' });
    }
  },
};
