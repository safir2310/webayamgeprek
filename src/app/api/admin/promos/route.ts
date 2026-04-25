import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const promos = await db.promo.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ promos })
  } catch (error) {
    console.error('Fetch promos error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil promo' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, discountPercent, minPurchase, startDate, endDate, isActive } = body

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Nama promo dan tanggal harus diisi' },
        { status: 400 }
      )
    }

    const promo = await db.promo.create({
      data: {
        name,
        description,
        discountPercent: parseFloat(discountPercent) || 0,
        minPurchase: parseFloat(minPurchase) || 0,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ promo })
  } catch (error) {
    console.error('Create promo error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat promo' },
      { status: 500 }
    )
  }
}
