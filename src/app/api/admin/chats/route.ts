import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      // Get chat messages for specific user
      const messages = await db.chatMessage.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      // Mark messages as read
      await db.chatMessage.updateMany({
        where: {
          userId,
          senderRole: 'user',
          isRead: false
        },
        data: { isRead: true }
      })

      return NextResponse.json({ messages })
    } else {
      // Get all chat messages for admin view
      const messages = await db.chatMessage.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ chats: messages })
    }
  } catch (error) {
    console.error('Chats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    )
  }
}

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
        message
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
