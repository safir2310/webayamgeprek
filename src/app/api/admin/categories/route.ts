import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nama kategori wajib diisi' },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: {
        name,
        description: description || null,
        image: image || null,
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Nama kategori sudah ada' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal membuat kategori baru' },
      { status: 500 }
    );
  }
}
