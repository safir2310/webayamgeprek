import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET today's sales
export async function GET(req: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's transactions
    const transactions = await db.transaction.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: 'completed',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Calculate totals
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0)
    const totalOrders = transactions.length

    // Group by payment method
    const paymentMethods = {
      cash: 0,
      qris: 0,
      transfer: 0,
    }

    transactions.forEach(t => {
      if (paymentMethods[t.paymentMethod as keyof typeof paymentMethods] !== undefined) {
        paymentMethods[t.paymentMethod as keyof typeof paymentMethods] += t.total
      }
    })

    // Get today's orders
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    const totalOnlineOrders = orders.length
    const totalOnlineSales = orders.reduce((sum, o) => sum + o.total, 0)

    return NextResponse.json({
      date: today.toISOString(),
      totalSales,
      totalOrders,
      totalOnlineOrders,
      totalOnlineSales,
      paymentMethods,
      transactions: transactions.length,
    })
  } catch (error) {
    console.error('Get today sales error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
