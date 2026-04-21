import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId, senderRole, message } = await request.json()

    if (!userId || !senderRole || !message) {
      return NextResponse.json(
        { error: 'UserId, senderRole, dan message harus diisi' },
        { status: 400 }
      )
    }

    const chatMessage = await db.chatMessage.create({
      data: {
        userId,
        senderRole,
        message,
        isRead: false
      }
    })

    return NextResponse.json({ chatMessage })
  } catch (error) {
    console.error('Send chat error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
