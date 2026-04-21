import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const whatsappSchema = z.object({
  phone: z.string().min(10),
  message: z.string().min(1),
  type: z.enum(['order', 'payment', 'shift', 'stock']).optional(),
})

// POST send WhatsApp message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone, message, type } = whatsappSchema.parse(body)

    // Format phone number (remove spaces and dashes)
    const formattedPhone = phone.replace(/[\s-]/g, '')

    // In production, integrate with WhatsApp API (e.g., Twilio, WhatsApp Business API)
    // For now, just log the message and save to database

    // Save message log
    const whatsappMessage = await db.whatsAppMessage.create({
      data: {
        phone: formattedPhone,
        message,
        type: type || 'order',
        status: 'pending',
      },
    })

    // Simulate sending message
    // In production, make actual API call to WhatsApp provider
    await db.whatsAppMessage.update({
      where: { id: whatsappMessage.id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Pesan WhatsApp berhasil dikirim',
      whatsappMessage,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Send WhatsApp error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
