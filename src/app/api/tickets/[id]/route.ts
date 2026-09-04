import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/store';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await dbRepository.updateTier(Number(id), body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Kategori tiket tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kategori tiket berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui kategori tiket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbRepository.deleteTier(Number(id));

    return NextResponse.json({
      success: true,
      message: 'Kategori tiket berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus kategori tiket' },
      { status: 500 }
    );
  }
}
