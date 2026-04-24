import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/favorites - Get all favorites for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const favorites = await db.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add a product to favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId } = body

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId and productId are required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Product already in favorites' },
        { status: 400 }
      )
    }

    const favorite = await db.favorite.create({
      data: {
        userId,
        productId
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}
