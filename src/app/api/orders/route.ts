import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbRepository } from '@/lib/store';

const orderSchema = z.object({
  user_id: z.number().nullable().optional(),
  event_id: z.number().int().positive('ID Event wajib diisi'),
  customer_name: z.string().min(2, 'Nama pemesan minimal 2 karakter'),
  customer_email: z.string().email('Format email tidak valid'),
  customer_phone: z.string().min(8, 'Nomor telepon minimal 8 digit'),
  customer_id_card: z.string().optional(),
  tier_id: z.number().int().positive('Pilih kategori tiket'),
  quantity: z.number().int().min(1, 'Jumlah tiket minimal 1').max(10, 'Maksimal 10 tiket per transaksi'),
  payment_method: z.enum(['qris', 'virtual_account', 'bank_transfer', 'credit_card']).default('qris'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const orders = await dbRepository.getAllOrders();
    const filtered = email 
      ? orders.filter((o) => o.customer_email.toLowerCase() === email.toLowerCase())
      : orders;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat pesanan' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Data pesanan tidak valid' },
        { status: 400 }
      );
    }

    const order = await dbRepository.createOrder(parsed.data);
    return NextResponse.json({
      success: true,
      message: 'Pesanan tiket berhasil dibuat',
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memproses pesanan tiket' },
      { status: 400 }
    );
  }
}
