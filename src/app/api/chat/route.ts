import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/chat - Get all chat messages for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const messages = await db.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    })

    const unreadCount = await db.chatMessage.count({
      where: {
        userId,
        isRead: false
      }
    })

    return NextResponse.json({
      messages,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat messages' },
      { status: 500 }
    )
  }
}

// POST /api/chat - Send a new chat message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { userId, senderRole, message } = body

    if (!userId || !senderRole || !message) {
      return NextResponse.json(
        { error: 'userId, senderRole, and message are required' },
        { status: 400 }
      )
    }

    // If user is sending, mark admin messages as read
    if (senderRole === 'user') {
      await db.chatMessage.updateMany({
        where: {
          userId,
          senderRole: 'admin'
        },
        data: {
          isRead: true
        }
      })
    }

    const chatMessage = await db.chatMessage.create({
      data: {
        userId,
        senderRole,
        message,
        isRead: false
      }
    })

    return NextResponse.json({ chatMessage }, { status: 201 })
  } catch (error) {
    console.error('Error creating chat message:', error)
    return NextResponse.json(
      { error: 'Failed to send chat message' },
      { status: 500 }
    )
  }
}
