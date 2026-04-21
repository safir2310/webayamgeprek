import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all orders (admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const orders = await db.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get admin orders error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
