import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/seed-data - Add sample notifications and chat messages for testing
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Create sample notifications
    const sampleNotifications = [
      {
        userId,
        title: 'Pesanan Selesai',
        message: 'Pesanan Anda #ORD001 telah selesai. Silakan ambil di kasir.',
        type: 'order',
        metadata: JSON.stringify({ orderId: 'ORD001' })
      },
      {
        userId,
        title: 'Poin Rewards',
        message: 'Anda mendapatkan 150 poin dari pesanan terakhir!',
        type: 'success',
        metadata: JSON.stringify({ pointsEarned: 150 })
      },
      {
        userId,
        title: 'Promo Spesial',
        message: 'Dapatkan diskon 20% untuk pesanan pertama Anda!',
        type: 'promo',
        metadata: JSON.stringify({ promoCode: 'WELCOME20' })
      }
    ]

    await db.notification.createMany({
      data: sampleNotifications
    })

    // Create sample chat messages
    const now = new Date()
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60000)
    const tenMinsAgo = new Date(now.getTime() - 10 * 60000)

    const sampleChatMessages = [
      {
        userId,
        senderRole: 'admin',
        message: 'Halo! Selamat datang di Ayam Geprek Sambal Ijo. Ada yang bisa saya bantu?',
        createdAt: fiveMinsAgo
      },
      {
        userId,
        senderRole: 'admin',
        message: 'Tentu saja! Kami memiliki variasi ayam geprek: Original, Keju, dan Telur. Semua dilengkapi sambal ijo pedas yang khas. Ada yang ingin Anda tanyakan lebih lanjut?',
        createdAt: tenMinsAgo
      }
    ]

    await db.chatMessage.createMany({
      data: sampleChatMessages
    })

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      notificationsCreated: sampleNotifications.length,
      chatMessagesCreated: sampleChatMessages.length
    })
  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json(
      { error: 'Failed to create sample data' },
      { status: 500 }
    )
  }
}
