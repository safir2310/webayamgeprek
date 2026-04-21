import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const voidSchema = z.object({
  transactionId: z.string(),
  reason: z.string().min(5),
  supervisorPin: z.string(),
})

// POST void transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { transactionId, reason, supervisorPin } = voidSchema.parse(body)

    // Find transaction
    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: {
        items: true,
        payments: true,
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      )
    }

    if (transaction.status === 'voided') {
      return NextResponse.json(
        { error: 'Transaksi sudah divoid' },
        { status: 400 }
      )
    }

    // In production, verify supervisor pin
    // For now, accept any pin with length 4
    if (supervisorPin.length !== 4) {
      return NextResponse.json(
        { error: 'PIN supervisor tidak valid' },
        { status: 401 }
      )
    }

    // Create void log
    await db.voidLog.create({
      data: {
        transactionId,
        reason,
        supervisorPin,
      },
    })

    // Update transaction status
    const voidedTransaction = await db.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'voided',
      },
    })

    // Restore stock
    for (const item of transaction.items) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.qty,
          },
        },
      })

      await db.stockLog.create({
        data: {
          productId: item.productId,
          qty: item.qty,
          type: 'void',
          reason: `Void transaction ${transaction.transactionNumber}`,
        },
      })
    }

    return NextResponse.json({
      transaction: voidedTransaction,
      message: 'Transaksi berhasil divoid',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Void transaction error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
