import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET current member data
export async function GET(req: NextRequest) {
  try {
    // In production, verify token and extract userId
    // For now, we'll use query param
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    // Get member data
    const member = await db.member.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Get member error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
