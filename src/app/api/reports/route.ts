import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // daily, weekly, monthly
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let reports

    if (type === 'today') {
      // Get today's report
      reports = await db.salesReport.findMany({
        where: {
          type: 'daily',
          reportDate: {
            gte: today
          }
        },
        orderBy: {
          reportDate: 'desc'
        },
        take: 1
      })
    } else if (type === 'latest') {
      // Get latest reports
      reports = await db.salesReport.findMany({
        orderBy: {
          reportDate: 'desc'
        },
        take: limit
      })
    } else {
      // Get all reports with optional type filter
      const where = type && type !== 'today' && type !== 'latest' ? { type } : {}
      reports = await db.salesReport.findMany({
        where,
        orderBy: {
          reportDate: 'desc'
        },
        take: limit
      })
    }

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Fetch reports error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil laporan' },
      { status: 500 }
    )
  }
}
