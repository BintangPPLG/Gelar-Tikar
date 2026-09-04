import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const newStatus = body.status === 'closed' ? 'closed' : 'open';

    const updated = await dbRepository.updateEvent(Number(id), { status: newStatus });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Event konser tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: newStatus === 'closed' ? 'Penjualan tiket berhasil ditutup' : 'Penjualan tiket berhasil dibuka',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengubah status penjualan tiket' },
      { status: 500 }
    );
  }
}
