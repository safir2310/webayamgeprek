import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/redeem-products - Get all redeem products
export async function GET() {
  try {
    const redeemProducts = await db.redeemProduct.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ redeemProducts })
  } catch (error) {
    console.error('Error fetching redeem products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch redeem products' },
      { status: 500 }
    )
  }
}

// POST /api/redeem-products - Create redeem product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, points, image, isActive, sortOrder, stock } = body

    // Validate required fields
    if (!name || !points) {
      return NextResponse.json(
        { error: 'Name and points are required' },
        { status: 400 }
      )
    }

    const redeemProduct = await db.redeemProduct.create({
      data: {
        name,
        description,
        points,
        image,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
        stock: stock ?? -1
      }
    })

    return NextResponse.json({ redeemProduct }, { status: 201 })
  } catch (error) {
    console.error('Error creating redeem product:', error)
    return NextResponse.json(
      { error: 'Failed to create redeem product' },
      { status: 500 }
    )
  }
}
