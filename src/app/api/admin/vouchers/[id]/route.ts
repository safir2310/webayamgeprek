import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { code, description, discountPercent, maxDiscount, minPurchase, usageLimit, startDate, endDate, isActive } = body

    const voucher = await db.voucher.update({
      where: { id: params.id },
      data: {
        ...(code !== undefined && { code }),
        ...(description !== undefined && { description }),
        ...(discountPercent !== undefined && { discountPercent: parseFloat(discountPercent) }),
        ...(maxDiscount !== undefined && { maxDiscount: parseFloat(maxDiscount) }),
        ...(minPurchase !== undefined && { minPurchase: parseFloat(minPurchase) }),
        ...(usageLimit !== undefined && { usageLimit: parseInt(usageLimit) }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({ voucher })
  } catch (error) {
    console.error('Update voucher error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate voucher' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.voucher.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete voucher error:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus voucher' },
      { status: 500 }
    )
  }
}
