import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    let settings = await db.settings.findFirst()

    // Create default settings if not exists
    if (!settings) {
      settings = await db.settings.create({
        data: {
          storeName: 'Ayam Geprek Sambal Ijo',
          storeAddress: '',
          storePhone: '',
          storeEmail: '',
          openingHours: '',
          taxRate: 10,
          serviceCharge: 0
        }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Fetch settings error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil pengaturan' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeName, storeAddress, storePhone, storeEmail, openingHours, taxRate, serviceCharge } = body

    const existing = await db.settings.findFirst()

    let settings
    if (existing) {
      settings = await db.settings.update({
        where: { id: existing.id },
        data: {
          storeName,
          storeAddress,
          storePhone,
          storeEmail,
          openingHours,
          taxRate: parseFloat(taxRate) || 0,
          serviceCharge: parseFloat(serviceCharge) || 0
        }
      })
    } else {
      settings = await db.settings.create({
        data: {
          storeName,
          storeAddress,
          storePhone,
          storeEmail,
          openingHours,
          taxRate: parseFloat(taxRate) || 0,
          serviceCharge: parseFloat(serviceCharge) || 0
        }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Save settings error:', error)
    return NextResponse.json(
      { error: 'Gagal menyimpan pengaturan' },
      { status: 500 }
    )
  }
}
