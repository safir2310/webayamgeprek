import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const cartItemSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  qty: z.number().int().min(1),
})

// GET user cart
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    let cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    // Create cart if doesn't exist
    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      })
    }

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST add to cart
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, productId, qty } = cartItemSchema.parse(body)

    // Get or create cart
    let cart = await db.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
      })
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if cart item exists
    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + qty },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      })

      return NextResponse.json({ item: updatedItem })
    } else {
      // Create new item
      const newItem = await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          qty,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      })

      return NextResponse.json({ item: newItem }, { status: 201 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
