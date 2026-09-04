import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbRepository } from '@/lib/store';

const eventSchema = z.object({
  title: z.string().min(3, 'Judul event minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  banner_url: z.string().min(1, 'Banner URL wajib diisi'),
  venue_name: z.string().min(3, 'Nama venue wajib diisi'),
  venue_address: z.string().min(5, 'Alamat venue wajib diisi'),
  event_date: z.string().min(1, 'Tanggal event wajib diisi'),
  end_date: z.string().optional(),
  status: z.enum(['draft', 'open', 'closed', 'sold_out']).default('open'),
});

export async function GET() {
  try {
    const events = await dbRepository.getAllEvents();
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat data konser' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Data event tidak valid' },
        { status: 400 }
      );
    }

    const newEvent = await dbRepository.createEvent(parsed.data);
    return NextResponse.json({
      success: true,
      message: 'Event konser berhasil ditambahkan',
      data: newEvent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menambahkan event konser' },
      { status: 500 }
    );
  }
}
