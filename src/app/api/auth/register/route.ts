import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbRepository } from '@/lib/store';
import { hashPassword, generateToken } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = parsed.data;
    const existing = await dbRepository.getUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Alamat email sudah terdaftar' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await dbRepository.createUser({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: 'customer',
    });

    const token = generateToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
