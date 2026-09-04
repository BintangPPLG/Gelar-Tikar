import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/store';

export async function GET() {
  try {
    const orders = await dbRepository.getAllOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat daftar pesanan' },
      { status: 500 }
    );
  }
}
