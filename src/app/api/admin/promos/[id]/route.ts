import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, discountPercent, minPurchase, startDate, endDate, isActive } = body

    const promo = await db.promo.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(discountPercent !== undefined && { discountPercent: parseFloat(discountPercent) }),
        ...(minPurchase !== undefined && { minPurchase: parseFloat(minPurchase) }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({ promo })
  } catch (error) {
    console.error('Update promo error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate promo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.promo.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete promo error:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus promo' },
      { status: 500 }
    )
  }
}
