import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET single feature
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const feature = await db.feature.findUnique({
      where: { id: params.id }
    });

    if (!feature) {
      return NextResponse.json(
        { error: 'Fitur tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(feature);
  } catch (error) {
    console.error('Error fetching feature:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data fitur' },
      { status: 500 }
    );
  }
}

// PUT update feature
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, icon, badge, isActive, sortOrder } = body;

    const feature = await db.feature.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        icon: icon || null,
        badge: badge || null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      }
    });

    return NextResponse.json(feature);
  } catch (error: any) {
    console.error('Error updating feature:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Fitur tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal mengupdate fitur' },
      { status: 500 }
    );
  }
}

// DELETE feature
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.feature.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Fitur berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus fitur' },
      { status: 500 }
    );
  }
}
