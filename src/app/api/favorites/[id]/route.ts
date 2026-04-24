import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE /api/favorites/[id] - Remove a product from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: favoriteId } = await params

    const favorite = await db.favorite.findFirst({
      where: { id: favoriteId }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    await db.favorite.deleteMany({
      where: { id: favoriteId }
    })

    return NextResponse.json({ message: 'Favorite removed' })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
