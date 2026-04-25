import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all features
export async function GET() {
  try {
    const features = await db.feature.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data fitur' },
      { status: 500 }
    );
  }
}

// POST create new feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, icon, badge, isActive, sortOrder } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Judul fitur wajib diisi' },
        { status: 400 }
      );
    }

    const feature = await db.feature.create({
      data: {
        title,
        description: description || null,
        icon: icon || null,
        badge: badge || null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      }
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json(
      { error: 'Gagal membuat fitur baru' },
      { status: 500 }
    );
  }
}
