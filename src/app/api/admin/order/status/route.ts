import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID dan status harus diisi' },
        { status: 400 }
      )
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: { status }
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Update order status error:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
