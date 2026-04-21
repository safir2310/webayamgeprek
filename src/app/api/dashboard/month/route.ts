import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET month's sales
export async function GET(req: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    // Get month's transactions
    const transactions = await db.transaction.findMany({
      where: {
        createdAt: {
          gte: monthAgo,
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
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

    // Group by day
    const dailySales = {}
    transactions.forEach(t => {
      const dateKey = new Date(t.createdAt).toISOString().split('T')[0]
      dailySales[dateKey] = (dailySales[dateKey] || 0) + t.total
    })

    // Generate last 30 days data
    const last30Days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      last30Days.push({
        date: dateKey,
        sales: dailySales[dateKey] || 0,
      })
    }

    return NextResponse.json({
      startDate: monthAgo.toISOString(),
      endDate: today.toISOString(),
      totalSales,
      totalOrders,
      avgOrderValue,
      dailySales: last30Days,
    })
  } catch (error) {
    console.error('Get month sales error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
