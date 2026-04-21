import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const shiftCloseSchema = z.object({
  cashierId: z.string(),
  closingCash: z.number().min(0),
})

// POST close shift
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cashierId, closingCash } = shiftCloseSchema.parse(body)

    // Find open shift
    const shift = await db.shift.findFirst({
      where: {
        cashierId,
        status: 'open',
      },
      include: {
        transactions: {
          where: { status: 'completed' },
        },
      },
    })

    if (!shift) {
      return NextResponse.json(
        { error: 'Tidak ada shift aktif ditemukan' },
        { status: 404 }
      )
    }

    // Calculate expected cash
    const totalCashTransactions = shift.transactions
      .filter(t => t.paymentMethod === 'cash')
      .reduce((sum, t) => sum + t.total, 0)
    const expectedCash = shift.openingCash + totalCashTransactions
    const difference = closingCash - expectedCash

    // Close shift
    const closedShift = await db.shift.update({
      where: { id: shift.id },
      data: {
        closingCash,
        expectedCash,
        difference,
        status: 'closed',
        closedAt: new Date(),
      },
      include: {
        cashier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transactions: {
          include: {
            items: true,
          },
        },
      },
    })

    return NextResponse.json({ shift: closedShift })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Close shift error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
