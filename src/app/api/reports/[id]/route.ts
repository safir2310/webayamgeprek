import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await db.salesReport.findUnique({
      where: { id: params.id }
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Laporan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedReport = {
      ...report,
      topSellingItems: report.topSellingItems ? JSON.parse(report.topSellingItems) : [],
      paymentBreakdown: report.paymentBreakdown ? JSON.parse(report.paymentBreakdown) : [],
      categoryBreakdown: report.categoryBreakdown ? JSON.parse(report.categoryBreakdown) : []
    }

    return NextResponse.json({ report: parsedReport })
  } catch (error) {
    console.error('Fetch report detail error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil detail laporan' },
      { status: 500 }
    )
  }
}
