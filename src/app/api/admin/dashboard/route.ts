import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/store';

export async function GET() {
  try {
    const metrics = await dbRepository.getDashboardMetrics();
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat statistik dashboard' },
      { status: 500 }
    );
  }
}
