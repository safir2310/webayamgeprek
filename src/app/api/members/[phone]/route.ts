import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET member by phone
export async function GET(
  req: NextRequest,
  { params }: { params: { phone: string } }
) {
  try {
    const member = await db.member.findFirst({
      where: {
        user: {
          phone: params.phone,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
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
