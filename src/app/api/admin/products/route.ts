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

    return NextResponse.json({ products })
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
    const { name, description, price, stock, category, image } = await request.json()

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Nama dan harga harus diisi' },
        { status: 400 }
      )
    }

    // Find or create category
    let categoryRecord = await db.category.findUnique({
      where: { name: category }
    })

    if (!categoryRecord) {
      categoryRecord = await db.category.create({
        data: { name: category }
      })
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId: categoryRecord.id,
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
