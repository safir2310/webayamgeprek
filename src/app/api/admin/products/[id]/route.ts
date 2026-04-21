import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, stock, category, image } = await request.json()
    const { id } = params

    // Find or create category
    let categoryRecord = await db.category.findUnique({
      where: { name: category }
    })

    if (!categoryRecord) {
      categoryRecord = await db.category.create({
        data: { name: category }
      })
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId: categoryRecord.id,
        image: image || '🍗'
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Soft delete by setting isActive to false
    await db.product.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
