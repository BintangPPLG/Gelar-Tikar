import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/store';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await dbRepository.updateArtist(Number(id), body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Artis tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data artis berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui artis' },
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
    await dbRepository.deleteArtist(Number(id));

    return NextResponse.json({
      success: true,
      message: 'Artis berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus artis' },
      { status: 500 }
    );
  }
}
