import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST payment callback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { invoiceId, status, amount, callbackData } = body

    // Find payment by invoice ID
    const payment = await db.payment.findFirst({
      where: { qrisInvoiceId: invoiceId },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update payment status
    const updatedPayment = await db.payment.update({
      where: { id: payment.id },
      data: {
        status: status === 'success' ? 'paid' : 'failed',
        callbackData: JSON.stringify(callbackData),
      },
    })

    // If payment successful, update related order or transaction status
    if (status === 'success') {
      if (payment.orderId) {
        await db.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: 'paid',
            status: 'processing',
          },
        })
      }

      if (payment.transactionId) {
        await db.transaction.update({
          where: { id: payment.transactionId },
          data: {
            status: 'completed',
          },
        })
      }
    }

    return NextResponse.json({
      message: 'Callback berhasil diproses',
      payment: updatedPayment,
    })
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
