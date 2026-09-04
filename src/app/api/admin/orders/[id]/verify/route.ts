import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status === 'rejected' ? 'rejected' : 'verified';

    const updated = await dbRepository.verifyPayment(Number(id), status);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: status === 'verified' ? 'Pembayaran berhasil diverifikasi (Lunas)' : 'Pembayaran ditolak',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memverifikasi pembayaran' },
      { status: 500 }
    );
  }
}
