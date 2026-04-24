import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function decodeToken(token: string) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = decodeToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Verify user is admin
    const currentUser = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    })

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}
    if (role) {
      where.role = role
    }

    // Get users
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Get total count
    const total = await db.user.count({ where })

    return NextResponse.json({
      users,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
