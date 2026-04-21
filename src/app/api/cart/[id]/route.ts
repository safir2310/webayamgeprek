import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const cartUpdateSchema = z.object({
  qty: z.number().int().min(0),
})

// PUT update cart item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { qty } = cartUpdateSchema.parse(body)

    if (qty === 0) {
      // Delete if qty is 0
      await db.cartItem.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Item dihapus dari keranjang' })
    }

    const item = await db.cartItem.update({
      where: { id: params.id },
      data: { qty },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json({ item })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// DELETE cart item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.cartItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Item dihapus dari keranjang' })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
