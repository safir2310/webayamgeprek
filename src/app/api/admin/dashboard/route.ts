import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get total orders
    const totalOrders = await db.order.count()

    // Get today's orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayOrders = await db.order.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // Get total revenue
    const orders = await db.order.findMany({
      where: { status: 'completed' }
    })
    const revenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get today's revenue
    const todayOrdersData = await db.order.findMany({
      where: {
        createdAt: { gte: today },
        status: 'completed'
      }
    })
    const todayRevenue = todayOrdersData.reduce((sum, order) => sum + order.total, 0)

    // Get total products
    const totalProducts = await db.product.count({
      where: { isActive: true }
    })

    // Get total customers (users with role 'user')
    const totalCustomers = await db.user.count({
      where: { role: 'user' }
    })

    // Get pending orders
    const pendingOrders = await db.order.count({
      where: { status: 'pending' }
    })

    // Get processing orders
    const processingOrders = await db.order.count({
      where: { status: 'processing' }
    })

    // Get completed orders
    const completedOrders = await db.order.count({
      where: { status: 'completed' }
    })

    // Get low stock products (stock < 20)
    const lowStockProducts = await db.product.findMany({
      where: {
        isActive: true,
        stock: { lt: 20 }
      }
    })

    return NextResponse.json({
      totalSales: revenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      todaySales: todayRevenue,
      todayOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      lowStock: lowStockProducts.length
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
