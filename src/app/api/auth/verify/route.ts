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
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const decoded = decodeToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      user,
    })
  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
