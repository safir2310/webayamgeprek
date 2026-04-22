import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'populer'
    const limit = parseInt(searchParams.get('limit') || '4')

    let products: any[] = []

    switch (type) {
      case 'populer':
        // Populer: Produk dengan jumlah order tertinggi (banyak yang pesan)
        products = await db.$queryRaw`
          SELECT
            p.*,
            c.name as categoryName
          FROM Product p
          LEFT JOIN Category c ON p.categoryId = c.id
          WHERE p.isActive = true
          ORDER BY p.createdAt DESC
          LIMIT ${limit}
        `
        break

      case 'terlaris':
        // Terlaris: Produk dengan stock yang paling sedikit (indikasi banyak terjual)
        products = await db.product.findMany({
          where: {
            isActive: true
          },
          include: {
            category: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            stock: 'asc'
          },
          take: limit
        })
        break

      case 'terbaru':
        // Terbaru: Produk yang baru saja dibuat
        products = await db.product.findMany({
          where: {
            isActive: true
          },
          include: {
            category: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: limit
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: populer, terlaris, or terbaru' },
          { status: 400 }
        )
    }

    // Format the response
    const formattedProducts = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      image: p.image,
      category: p.categoryName || p.category?.name || 'Other',
      createdAt: p.createdAt
    }))

    return NextResponse.json({
      type,
      products: formattedProducts
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
