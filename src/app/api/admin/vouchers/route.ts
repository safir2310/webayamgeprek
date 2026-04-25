import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const vouchers = await db.voucher.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ vouchers })
  } catch (error) {
    console.error('Fetch vouchers error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil voucher' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, description, discountPercent, maxDiscount, minPurchase, usageLimit, startDate, endDate, isActive } = body

    if (!code || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Kode voucher dan tanggal harus diisi' },
        { status: 400 }
      )
    }

    const voucher = await db.voucher.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountPercent: parseFloat(discountPercent) || 0,
        maxDiscount: parseFloat(maxDiscount) || 0,
        minPurchase: parseFloat(minPurchase) || 0,
        usageLimit: parseInt(usageLimit) || 0,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ voucher })
  } catch (error) {
    console.error('Create voucher error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat voucher' },
      { status: 500 }
    )
  }
}
