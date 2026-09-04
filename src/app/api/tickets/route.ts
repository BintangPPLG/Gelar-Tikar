import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbRepository } from '@/lib/store';

const ticketTierSchema = z.object({
  event_id: z.number().int().positive('ID Event wajib diisi'),
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  price: z.number().positive('Harga tiket harus bernilai positif'),
  total_quota: z.number().int().positive('Total kuota harus lebih dari 0'),
  description: z.string().optional(),
  perks_json: z.union([z.array(z.string()), z.string()]).optional(),
  status: z.enum(['active', 'closed', 'sold_out']).default('active'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    const tiers = eventId
      ? await dbRepository.getTiersByEventId(Number(eventId))
      : await dbRepository.getAllTiers();

    return NextResponse.json({ success: true, data: tiers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat kategori tiket' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ticketTierSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Data tiket tidak valid' },
        { status: 400 }
      );
    }

    const newTier = await dbRepository.createTier(parsed.data);
    return NextResponse.json({
      success: true,
      message: 'Kategori tiket berhasil ditambahkan',
      data: newTier,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menambahkan kategori tiket' },
      { status: 500 }
    );
  }
}
