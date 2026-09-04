import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await dbRepository.getEventByIdOrSlug(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event konser tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat detail konser' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await dbRepository.updateEvent(Number(id), body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Event konser tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event konser berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui konser' },
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
    await dbRepository.deleteEvent(Number(id));

    return NextResponse.json({
      success: true,
      message: 'Event konser berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus konser' },
      { status: 500 }
    );
  }
}
