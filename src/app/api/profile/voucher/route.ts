import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, rewardType, pointsUsed } = body

    if (!userId || !rewardType || !pointsUsed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Define reward configurations
    const rewardConfigs: Record<string, any> = {
      voucher100k: {
        discountAmount: 100000,
        discountPercent: 0,
        minPurchase: 300000,
        maxDiscount: 100000,
        name: 'Voucher Rp 100.000',
        daysValid: 30
      },
      diskon20: {
        discountAmount: 0,
        discountPercent: 20,
        minPurchase: 0,
        maxDiscount: 50000,
        name: 'Diskon 20%',
        daysValid: 30
      },
      gratisongkir: {
        discountAmount: 0,
        discountPercent: 0,
        minPurchase: 50000,
        maxDiscount: 25000,
        name: 'Gratis Ongkir',
        daysValid: 14
      },
      bogo: {
        discountAmount: 0,
        discountPercent: 0,
        minPurchase: 0,
        maxDiscount: 0,
        name: 'Buy 1 Get 1 Free',
        daysValid: 7
      },
      freedrink: {
        discountAmount: 0,
        discountPercent: 100,
        minPurchase: 20000,
        maxDiscount: 15000,
        name: 'Minuman Gratis',
        daysValid: 7
      },
      specialmenu: {
        discountAmount: 0,
        discountPercent: 0,
        minPurchase: 0,
        maxDiscount: 0,
        name: 'Menu Spesial',
        daysValid: 30
      },
      birthday: {
        discountAmount: 0,
        discountPercent: 0,
        minPurchase: 0,
        maxDiscount: 0,
        name: 'Birthday Special',
        daysValid: 60
      },
      cashback: {
        discountAmount: 0,
        discountPercent: 10,
        minPurchase: 0,
        maxDiscount: 30000,
        name: 'Cashback 10%',
        daysValid: 21
      }
    }

    const config = rewardConfigs[rewardType]
    if (!config) {
      return NextResponse.json(
        { error: 'Invalid reward type' },
        { status: 400 }
      )
    }

    // Generate unique voucher code
    const generateVoucherCode = () => {
      const prefix = 'AYAM'
      const random = Math.random().toString(36).substring(2, 8).toUpperCase()
      return `${prefix}${random}`
    }

    let voucherCode = generateVoucherCode()
    let attempts = 0
    let isUnique = false

    // Ensure voucher code is unique
    while (!isUnique && attempts < 10) {
      const existing = await db.voucher.findUnique({
        where: { code: voucherCode }
      })
      if (!existing) {
        isUnique = true
      } else {
        voucherCode = generateVoucherCode()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique voucher code' },
        { status: 500 }
      )
    }

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + config.daysValid)

    // Create voucher
    const voucher = await db.voucher.create({
      data: {
        code: voucherCode,
        userId,
        type: rewardType,
        discountAmount: config.discountAmount,
        discountPercent: config.discountPercent,
        minPurchase: config.minPurchase,
        maxDiscount: config.maxDiscount,
        pointsUsed,
        expiresAt
      }
    })

    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        type: voucher.type,
        name: config.name,
        discountAmount: voucher.discountAmount,
        discountPercent: voucher.discountPercent,
        minPurchase: voucher.minPurchase,
        maxDiscount: voucher.maxDiscount,
        expiresAt: voucher.expiresAt
      }
    })
  } catch (error) {
    console.error('Voucher generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate voucher' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve user's vouchers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    const vouchers = await db.voucher.findMany({
      where: {
        userId,
        isUsed: false,
        expiresAt: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      vouchers
    })
  } catch (error) {
    console.error('Get vouchers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    )
  }
}
