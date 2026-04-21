import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'completed', 'cancelled']),
})

// PUT update order status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { status } = orderStatusSchema.parse(body)

    const order = await db.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        payments: true,
      },
    })

    // Update payment status if order is paid
    if (status === 'paid' || status === 'processing' || status === 'completed') {
      await db.payment.updateMany({
        where: { orderId: params.id },
        data: { status: 'paid' },
      })
    }

    return NextResponse.json({ order })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update order status error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
