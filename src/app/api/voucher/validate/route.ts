import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, userId, cartTotal } = body

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'Missing voucher code or userId' },
        { status: 400 }
      )
    }

    // Find voucher
    const voucher = await db.voucher.findUnique({
      where: { code }
    })

    if (!voucher) {
      return NextResponse.json(
        { error: 'Voucher tidak valid', valid: false },
        { status: 200 }
      )
    }

    // Check if voucher belongs to user
    if (voucher.userId !== userId) {
      return NextResponse.json(
        { error: 'Voucher ini bukan milik Anda', valid: false },
        { status: 200 }
      )
    }

    // Check if voucher is already used
    if (voucher.isUsed) {
      return NextResponse.json(
        { error: 'Voucher sudah digunakan', valid: false },
        { status: 200 }
      )
    }

    // Check if voucher is expired
    if (new Date() > voucher.expiresAt) {
      return NextResponse.json(
        { error: 'Voucher telah kedaluwarsa', valid: false },
        { status: 200 }
      )
    }

    // Check minimum purchase requirement
    if (cartTotal && cartTotal < voucher.minPurchase) {
      return NextResponse.json(
        {
          error: `Minimum pembelian Rp ${voucher.minPurchase.toLocaleString()}`,
          valid: false,
          minPurchase: voucher.minPurchase
        },
        { status: 200 }
      )
    }

    // Calculate discount
    let discount = 0
    if (voucher.discountAmount > 0) {
      discount = voucher.discountAmount
    } else if (voucher.discountPercent > 0) {
      discount = (cartTotal * voucher.discountPercent) / 100
      // Apply max discount cap
      if (voucher.maxDiscount > 0 && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount
      }
    }

    // For special rewards (BOGO, Special Menu, Birthday), return special type
    let rewardType = 'discount'
    if (['bogo', 'specialmenu', 'birthday'].includes(voucher.type)) {
      rewardType = 'special'
    }

    return NextResponse.json({
      success: true,
      valid: true,
      voucher: {
        code: voucher.code,
        type: voucher.type,
        discountAmount: voucher.discountAmount,
        discountPercent: voucher.discountPercent,
        minPurchase: voucher.minPurchase,
        maxDiscount: voucher.maxDiscount,
        discount,
        rewardType,
        expiresAt: voucher.expiresAt
      }
    })
  } catch (error) {
    console.error('Voucher validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate voucher', valid: false },
      { status: 500 }
    )
  }
}

// PATCH endpoint to mark voucher as used
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Missing voucher code' },
        { status: 400 }
      )
    }

    const voucher = await db.voucher.update({
      where: { code },
      data: {
        isUsed: true,
        usedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      voucher
    })
  } catch (error) {
    console.error('Voucher update error:', error)
    return NextResponse.json(
      { error: 'Failed to update voucher' },
      { status: 500 }
    )
  }
}
