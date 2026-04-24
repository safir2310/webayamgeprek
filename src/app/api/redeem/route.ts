import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/redeem - Redeem a product using points
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, redeemProductId } = body

    if (!userId || !redeemProductId) {
      return NextResponse.json(
        { error: 'userId and redeemProductId are required' },
        { status: 400 }
      )
    }

    // Get user's member data
    const member = await db.member.findUnique({
      where: { userId }
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Get redeem product
    const redeemProduct = await db.redeemProduct.findUnique({
      where: { id: redeemProductId }
    })

    if (!redeemProduct) {
      return NextResponse.json(
        { error: 'Redeem product not found' },
        { status: 404 }
      )
    }

    // Check if product is active
    if (!redeemProduct.isActive) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      )
    }

    // Check if user has enough points
    if (member.points < redeemProduct.points) {
      return NextResponse.json(
        { error: 'Not enough points' },
        { status: 400 }
      )
    }

    // Check stock if not unlimited
    if (redeemProduct.stock > 0) {
      if (redeemProduct.stock <= 0) {
        return NextResponse.json(
          { error: 'Product out of stock' },
          { status: 400 }
        )
      }
    }

    // Create voucher for the redeemed product
    const voucherCode = `REDEEM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const voucher = await db.voucher.create({
      data: {
        code: voucherCode,
        userId,
        type: 'specialmenu', // Can be customized based on product
        discountAmount: 0,
        discountPercent: 0,
        minPurchase: 0,
        maxDiscount: 0,
        pointsUsed: redeemProduct.points,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    })

    // Deduct points
    await db.member.update({
      where: { userId },
      data: {
        points: member.points - redeemProduct.points
      }
    })

    // Update stock if not unlimited
    if (redeemProduct.stock > 0) {
      await db.redeemProduct.update({
        where: { id: redeemProductId },
        data: {
          stock: redeemProduct.stock - 1
        }
      })
    }

    return NextResponse.json({
      message: 'Product redeemed successfully',
      voucher,
      pointsUsed: redeemProduct.points
    })
  } catch (error) {
    console.error('Error redeeming product:', error)
    return NextResponse.json(
      { error: 'Failed to redeem product' },
      { status: 500 }
    )
  }
}
