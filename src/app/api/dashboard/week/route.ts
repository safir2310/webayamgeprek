import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET week's sales
export async function GET(req: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    // Get week's transactions
    const transactions = await db.transaction.findMany({
      where: {
        createdAt: {
          gte: weekAgo,
          lt: today,
        },
        status: 'completed',
      },
      include: {
        items: true,
      },
    })

    // Calculate totals
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0)
    const totalOrders = transactions.length

    // Group by day
    const dailySales = {}
    transactions.forEach(t => {
      const dateKey = new Date(t.createdAt).toISOString().split('T')[0]
      dailySales[dateKey] = (dailySales[dateKey] || 0) + t.total
    })

    // Generate last 7 days data
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      last7Days.push({
        date: dateKey,
        sales: dailySales[dateKey] || 0,
      })
    }

    return NextResponse.json({
      startDate: weekAgo.toISOString(),
      endDate: today.toISOString(),
      totalSales,
      totalOrders,
      dailySales: last7Days,
    })
  } catch (error) {
    console.error('Get week sales error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
