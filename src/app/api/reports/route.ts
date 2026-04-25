import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // daily, weekly, monthly
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = type ? { type } : {}

    const reports = await db.salesReport.findMany({
      where,
      orderBy: {
        reportDate: 'desc'
      },
      take: limit
    })

    // Parse JSON fields for each report
    const parsedReports = reports.map(report => ({
      ...report,
      topSellingItems: report.topSellingItems ? JSON.parse(report.topSellingItems) : [],
      paymentBreakdown: report.paymentBreakdown ? JSON.parse(report.paymentBreakdown) : [],
      categoryBreakdown: report.categoryBreakdown ? JSON.parse(report.categoryBreakdown) : []
    }))

    return NextResponse.json({ reports: parsedReports })
  } catch (error) {
    console.error('Fetch reports error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil laporan' },
      { status: 500 }
    )
  }
}
