import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Clean up image data - only return first 100 chars or emoji if base64 is too long
    const cleanedProducts = products.map(product => {
      let cleanedImage = product.image
      if (product.image && product.image.length > 100) {
        // If it's a very long base64 string, truncate it for display
        cleanedImage = product.image.substring(0, 100)
      }
      return {
        ...product,
        image: cleanedImage
      }
    })

    return NextResponse.json({ products: cleanedProducts })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, stock, categoryId, image } = await request.json()

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Nama dan harga harus diisi' },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Kategori harus dipilih' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId: categoryId,
        image: image || '🍗',
        isActive: true
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
