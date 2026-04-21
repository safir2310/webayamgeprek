import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all notifications (global notifications without userId)
    const notifications = await db.notification.findMany({
      where: { userId: null },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, message, type } = await request.json()

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Judul dan pesan harus diisi' },
        { status: 400 }
      )
    }

    // Get all users to send notification to
    const users = await db.user.findMany({
      where: { role: 'user' }
    })

    // Create notification for each user
    const notifications = await Promise.all(
      users.map(user =>
        db.notification.create({
          data: {
            userId: user.id,
            title,
            message,
            type: type || 'info',
            isRead: false
          }
        })
      )
    )

    // Also create a global notification record
    await db.notification.create({
      data: {
        userId: null,
        title,
        message,
        type: type || 'info',
        isRead: false
      }
    })

    return NextResponse.json({ count: notifications.length })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
