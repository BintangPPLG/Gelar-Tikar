import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbRepository } from '@/lib/store';

const artistSchema = z.object({
  name: z.string().min(2, 'Nama artis minimal 2 karakter'),
  genre: z.string().min(2, 'Genre musik wajib diisi'),
  bio: z.string().optional(),
  image_url: z.string().optional(),
  spotify_url: z.string().optional(),
  instagram_url: z.string().optional(),
});

export async function GET() {
  try {
    const artists = await dbRepository.getAllArtists();
    return NextResponse.json({ success: true, data: artists });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat data artis' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = artistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Data artis tidak valid' },
        { status: 400 }
      );
    }

    const newArtist = await dbRepository.createArtist(parsed.data);
    return NextResponse.json({
      success: true,
      message: 'Artis berhasil ditambahkan',
      data: newArtist,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menambahkan artis' },
      { status: 500 }
    );
  }
}
