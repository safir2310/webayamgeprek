import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { randomUUID } from 'crypto'

const qrisSchema = z.object({
  orderId: z.string().optional(),
  transactionId: z.string().optional(),
  amount: z.number().positive(),
})

// POST create QRIS payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, transactionId, amount } = qrisSchema.parse(body)

    if (!orderId && !transactionId) {
      return NextResponse.json(
        { error: 'Order ID atau Transaction ID diperlukan' },
        { status: 400 }
      )
    }

    // Generate invoice ID
    const invoiceId = `INV${Date.now()}`

    // In production, integrate with actual QRIS provider (e.g., Midtrans, Xendit)
    // For now, return mock QR code data
    const qrCode = `QRIS-${randomUUID()}-${invoiceId}-${amount}`

    // Create or update payment record
    let payment
    if (orderId) {
      payment = await db.payment.findFirst({
        where: { orderId },
      })

      if (payment) {
        payment = await db.payment.update({
          where: { id: payment.id },
          data: {
            qrisInvoiceId: invoiceId,
            qrCode,
            status: 'pending',
          },
        })
      } else {
        payment = await db.payment.create({
          data: {
            orderId,
            amount,
            method: 'qris',
            qrisInvoiceId: invoiceId,
            qrCode,
            status: 'pending',
          },
        })
      }
    } else if (transactionId) {
      payment = await db.payment.findFirst({
        where: { transactionId },
      })

      if (payment) {
        payment = await db.payment.update({
          where: { id: payment.id },
          data: {
            qrisInvoiceId: invoiceId,
            qrCode,
            status: 'pending',
          },
        })
      } else {
        payment = await db.payment.create({
          data: {
            transactionId,
            amount,
            method: 'qris',
            qrisInvoiceId: invoiceId,
            qrCode,
            status: 'pending',
          },
        })
      }
    }

    return NextResponse.json({
      qrCode,
      invoiceId,
      amount,
      paymentId: payment?.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create QRIS error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
