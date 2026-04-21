import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const orderSchema = z.object({
  userId: z.string(),
  address: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    qty: z.number().int().min(1),
    price: z.number(),
  })),
})

// POST create order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = orderSchema.parse(body)

    // Get user cart
    const cart = await db.cart.findUnique({
      where: { userId: data.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Keranjang kosong' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    )
    const tax = subtotal * 0.1
    const total = subtotal + tax

    // Generate order number
    const orderCount = await db.order.count()
    const orderNumber = `ORD${String(orderCount + 1).padStart(5, '0')}`

    // Create order with items
    const order = await db.order.create({
      data: {
        userId: data.userId,
        orderNumber,
        subtotal,
        tax,
        discount: 0,
        total,
        address: data.address,
        note: data.note,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending',
        status: 'pending',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            qty: item.qty,
            price: item.product.price,
            subtotal: item.product.price * item.qty,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    // Create payment record
    await db.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        method: data.paymentMethod,
        status: 'pending',
      },
    })

    // Clear cart
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
