import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { type, date } = await request.json()

    if (!type || !date) {
      return NextResponse.json(
        { error: 'Tipe dan tanggal laporan harus diisi' },
        { status: 400 }
      )
    }

    const reportDate = new Date(date)

    // Calculate date range based on report type
    let startDate: Date
    let endDate: Date

    if (type === 'daily') {
      startDate = new Date(reportDate.setHours(0, 0, 0, 0))
      endDate = new Date(reportDate.setHours(23, 59, 59, 999))
    } else if (type === 'weekly') {
      // Get the start of the week (Monday)
      const day = reportDate.getDay()
      const diff = reportDate.getDate() - day + (day === 0 ? -6 : 1)
      startDate = new Date(reportDate.setDate(diff))
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)
    } else if (type === 'monthly') {
      startDate = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1)
      endDate = new Date(reportDate.getFullYear(), reportDate.getMonth() + 1, 0)
      endDate.setHours(23, 59, 59, 999)
    } else {
      return NextResponse.json(
        { error: 'Tipe laporan tidak valid' },
        { status: 400 }
      )
    }

    // Fetch orders
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    // Fetch transactions (POS)
    const transactions = await db.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'completed'
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    // Calculate metrics
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0) +
                     transactions.reduce((sum, tx) => sum + tx.total, 0)

    const totalOrders = orders.length
    const totalTransactions = transactions.length
    const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.qty, 0), 0) +
                     transactions.reduce((sum, tx) => sum + tx.items.reduce((s, item) => s + item.qty, 0), 0)

    const totalSalesCount = totalOrders + totalTransactions
    const averageOrderValue = totalSalesCount > 0 ? totalSales / totalSalesCount : 0

    // Calculate sales by payment method
    let cashSales = 0
    let qrisSales = 0
    let transferSales = 0

    orders.forEach(order => {
      if (order.paymentMethod === 'cash') cashSales += order.total
      else if (order.paymentMethod === 'qris') qrisSales += order.total
      else if (order.paymentMethod === 'transfer') transferSales += order.total
    })

    transactions.forEach(tx => {
      if (tx.paymentMethod === 'cash') cashSales += tx.total
      else if (tx.paymentMethod === 'qris') qrisSales += tx.total
      else if (tx.paymentMethod === 'transfer') transferSales += tx.total
    })

    // Count orders by status
    const completedOrders = orders.filter(o => o.status === 'completed').length
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

    // Calculate top selling items
    const productSales = new Map<string, { name: string, qty: number, revenue: number }>()

    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.productId
        const existing = productSales.get(key)
        if (existing) {
          existing.qty += item.qty
          existing.revenue += item.subtotal
        } else {
          productSales.set(key, {
            name: item.product.name,
            qty: item.qty,
            revenue: item.subtotal
          })
        }
      })
    })

    transactions.forEach(tx => {
      tx.items.forEach(item => {
        const key = item.productId
        const existing = productSales.get(key)
        if (existing) {
          existing.qty += item.qty
          existing.revenue += item.subtotal
        } else {
          productSales.set(key, {
            name: item.product.name,
            qty: item.qty,
            revenue: item.subtotal
          })
        }
      })
    })

    const topSellingItems = Array.from(productSales.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10)
      .map(item => ({
        name: item.name,
        qty: item.qty,
        revenue: item.revenue
      }))

    // Calculate category breakdown
    const categorySales = new Map<string, { name: string, revenue: number, count: number }>()

    orders.forEach(order => {
      order.items.forEach(item => {
        const categoryName = item.product.category.name
        const existing = categorySales.get(categoryName)
        if (existing) {
          existing.revenue += item.subtotal
          existing.count += item.qty
        } else {
          categorySales.set(categoryName, {
            name: categoryName,
            revenue: item.subtotal,
            count: item.qty
          })
        }
      })
    })

    transactions.forEach(tx => {
      tx.items.forEach(item => {
        const categoryName = item.product.category.name
        const existing = categorySales.get(categoryName)
        if (existing) {
          existing.revenue += item.subtotal
          existing.count += item.qty
        } else {
          categorySales.set(categoryName, {
            name: categoryName,
            revenue: item.subtotal,
            count: item.qty
          })
        }
      })
    })

    const categoryBreakdown = Array.from(categorySales.values()).map(cat => ({
      name: cat.name,
      revenue: cat.revenue,
      count: cat.count
    }))

    // Payment breakdown
    const paymentBreakdown = [
      { method: 'Cash', amount: cashSales, percentage: totalSales > 0 ? (cashSales / totalSales) * 100 : 0 },
      { method: 'QRIS', amount: qrisSales, percentage: totalSales > 0 ? (qrisSales / totalSales) * 100 : 0 },
      { method: 'Transfer', amount: transferSales, percentage: totalSales > 0 ? (transferSales / totalSales) * 100 : 0 }
    ]

    // Check if report already exists
    const existingReport = await db.salesReport.findFirst({
      where: {
        type,
        reportDate: startDate
      }
    })

    let report
    if (existingReport) {
      report = await db.salesReport.update({
        where: { id: existingReport.id },
        data: {
          totalSales,
          totalOrders,
          totalTransactions,
          totalItems,
          averageOrderValue,
          cashSales,
          qrisSales,
          transferSales,
          completedOrders,
          cancelledOrders,
          topSellingItems: JSON.stringify(topSellingItems),
          paymentBreakdown: JSON.stringify(paymentBreakdown),
          categoryBreakdown: JSON.stringify(categoryBreakdown)
        }
      })
    } else {
      report = await db.salesReport.create({
        data: {
          type,
          reportDate: startDate,
          totalSales,
          totalOrders,
          totalTransactions,
          totalItems,
          averageOrderValue,
          cashSales,
          qrisSales,
          transferSales,
          completedOrders,
          cancelledOrders,
          topSellingItems: JSON.stringify(topSellingItems),
          paymentBreakdown: JSON.stringify(paymentBreakdown),
          categoryBreakdown: JSON.stringify(categoryBreakdown)
        }
      })
    }

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Generate report error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat laporan' },
      { status: 500 }
    )
  }
}
