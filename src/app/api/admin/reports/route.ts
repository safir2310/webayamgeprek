import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '30')

    const where = type ? { type } : {}

    const reports = await db.salesReport.findMany({
      where,
      orderBy: {
        reportDate: 'desc'
      },
      take: limit
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Fetch reports error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil laporan' },
      { status: 500 }
    )
  }
}
