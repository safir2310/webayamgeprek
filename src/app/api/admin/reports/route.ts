import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'daily'

    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'daily':
        // Start of today
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'weekly':
        // Start of week (7 days ago)
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        // Start of month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    // Get completed orders within period
    const orders = await db.order.findMany({
      where: {
        status: 'completed',
        createdAt: {
          gte: startDate
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group by date
    const groupedReports = orders.reduce((acc: any, order) => {
      const date = new Date(order.createdAt).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      const total = order.total
      const itemsSold = order._count.items || 0

      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          itemsSold: 0,
          orders: 0
        }
      }

      acc[date].total += total
      acc[date].itemsSold += itemsSold
      acc[date].orders += 1

      return acc
    }, {})

    const reports = Object.values(groupedReports)

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
