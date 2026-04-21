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
      // Get all users with chat messages
      const chats = await db.chatMessage.groupBy({
        by: ['userId'],
        _count: {
          id: true
        },
        _max: {
          createdAt: true
        }
      })

      const chatData = await Promise.all(
        chats.map(async (chat) => {
          const user = await db.user.findUnique({
            where: { id: chat.userId }
          })

          const unreadCount = await db.chatMessage.count({
            where: {
              userId: chat.userId,
              senderRole: 'user',
              isRead: false
            }
          })

          return {
            userId: chat.userId,
            user,
            unreadCount,
            lastMessage: chat._max.createdAt
          }
        })
      )

      // Sort by last message
      chatData.sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage).getTime() : 0
        const bTime = b.lastMessage ? new Date(b.lastMessage).getTime() : 0
        return bTime - aTime
      })

      return NextResponse.json({ chats: chatData })
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
