import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/redeem-products/[id] - Get redeem product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const redeemProduct = await db.redeemProduct.findUnique({
      where: { id }
    })

    if (!redeemProduct) {
      return NextResponse.json(
        { error: 'Redeem product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ redeemProduct })
  } catch (error) {
    console.error('Error fetching redeem product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch redeem product' },
      { status: 500 }
    )
  }
}

// PATCH /api/redeem-products/[id] - Update redeem product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, points, image, isActive, sortOrder, stock } = body

    // Check if redeem product exists
    const existing = await db.redeemProduct.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Redeem product not found' },
        { status: 404 }
      )
    }

    const redeemProduct = await db.redeemProduct.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(points !== undefined && { points }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(stock !== undefined && { stock })
      }
    })

    return NextResponse.json({ redeemProduct })
  } catch (error) {
    console.error('Error updating redeem product:', error)
    return NextResponse.json(
      { error: 'Failed to update redeem product' },
      { status: 500 }
    )
  }
}

// DELETE /api/redeem-products/[id] - Delete redeem product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if redeem product exists
    const existing = await db.redeemProduct.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Redeem product not found' },
        { status: 404 }
      )
    }

    await db.redeemProduct.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Redeem product deleted' })
  } catch (error) {
    console.error('Error deleting redeem product:', error)
    return NextResponse.json(
      { error: 'Failed to delete redeem product' },
      { status: 500 }
    )
  }
}
