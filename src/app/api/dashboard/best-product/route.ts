import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET best selling products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'week' // today, week, month

    let startDate: Date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (period === 'today') {
      startDate = today
    } else if (period === 'week') {
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === 'month') {
      startDate = new Date(today)
      startDate.setMonth(startDate.getMonth() - 1)
    } else {
      startDate = new Date(today)
      startDate.setFullYear(startDate.getFullYear() - 1)
    }

    // Get transactions with items
    const transactions = await db.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
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

    // Aggregate product sales
    const productSales = new Map<string, {
      productId: string
      name: string
      category: string
      totalQty: number
      totalRevenue: number
    }>()

    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        const key = item.productId
        const existing = productSales.get(key)

        if (existing) {
          existing.totalQty += item.qty
          existing.totalRevenue += item.subtotal
        } else {
          productSales.set(key, {
            productId: item.product.id,
            name: item.product.name,
            category: item.product.category?.name || 'Uncategorized',
            totalQty: item.qty,
            totalRevenue: item.subtotal,
          })
        }
      })
    })

    // Sort by quantity and get top 10
    const bestProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 10)

    return NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
      bestProducts,
    })
  } catch (error) {
    console.error('Get best product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
