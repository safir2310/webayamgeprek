import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const featuredProducts = await db.featuredProduct.findMany({
      where: { isActive: true },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({ featuredProducts })
  } catch (error) {
    console.error('Fetch featured products error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil produk unggulan' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, isFeatured } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID harus diisi' },
        { status: 400 }
      )
    }

    if (isFeatured) {
      // Add to featured
      const existing = await db.featuredProduct.findUnique({
        where: { productId }
      })

      if (!existing) {
        const maxSort = await db.featuredProduct.findFirst({
          orderBy: { sortOrder: 'desc' }
        })
        const sortOrder = (maxSort?.sortOrder || 0) + 1

        await db.featuredProduct.create({
          data: { productId, sortOrder, isActive: true }
        })
      }
    } else {
      // Remove from featured
      await db.featuredProduct.deleteMany({
        where: { productId }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Toggle featured product error:', error)
    return NextResponse.json(
      { error: 'Gagal mengubah status unggulan' },
      { status: 500 }
    )
  }
}
