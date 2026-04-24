import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/favorites/check?userId=xxx&productId=xxx - Check if product is favorited
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId and productId are required' },
        { status: 400 }
      )
    }

    const favorite = await db.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error('Error checking favorite:', error)
    return NextResponse.json(
      { error: 'Failed to check favorite' },
      { status: 500 }
    )
  }
}
