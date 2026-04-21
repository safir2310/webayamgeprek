import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const transactionSchema = z.object({
  shiftId: z.string().optional(),
  cashierId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    qty: z.number().int().min(1),
    price: z.number(),
  })),
  paymentMethod: z.string(),
  note: z.string().optional(),
})

// GET all transactions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const shiftId = searchParams.get('shiftId')
    const cashierId = searchParams.get('cashierId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const transactions = await db.transaction.findMany({
      where: {
        ...(shiftId && { shiftId }),
        ...(cashierId && { cashierId }),
        ...(startDate && endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shift: true,
        cashier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
        voids: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST create transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = transactionSchema.parse(body)

    // Calculate totals
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    )
    const tax = subtotal * 0.1
    const total = subtotal + tax

    // Generate transaction number
    const transactionCount = await db.transaction.count()
    const transactionNumber = `TRX${String(transactionCount + 1).padStart(5, '0')}`

    // Create transaction with items
    const transaction = await db.transaction.create({
      data: {
        shiftId: data.shiftId,
        cashierId: data.cashierId,
        transactionNumber,
        subtotal,
        tax,
        discount: 0,
        total,
        paymentMethod: data.paymentMethod,
        note: data.note,
        status: 'completed',
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price,
            subtotal: item.price * item.qty,
          })),
        },
        payments: {
          create: {
            amount: total,
            method: data.paymentMethod,
            status: 'paid',
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update stock and create stock logs
    for (const item of data.items) {
      // Update product stock
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.qty,
          },
        },
      })

      // Create stock log
      await db.stockLog.create({
        data: {
          productId: item.productId,
          qty: -item.qty,
          type: 'sale',
          reason: `Transaction ${transactionNumber}`,
        },
      })
    }

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
