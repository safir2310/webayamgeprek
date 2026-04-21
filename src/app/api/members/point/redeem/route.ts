import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const redeemPointSchema = z.object({
  userId: z.string(),
  points: z.number().int().positive(),
})

// POST redeem points
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, points } = redeemPointSchema.parse(body)

    // Find member
    const member = await db.member.findUnique({
      where: { userId },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if user has enough points
    if (member.points < points) {
      return NextResponse.json(
        { error: 'Poin tidak mencukupi' },
        { status: 400 }
      )
    }

    // Calculate discount (100 points = Rp 1,000)
    const discount = points * 1000

    // Update member points
    const updatedMember = await db.member.update({
      where: { userId },
      data: {
        points: {
          decrement: points,
        },
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json({
      member: updatedMember,
      discount,
      message: `Poin berhasil ditukarkan. Diskon: Rp ${discount.toLocaleString()}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Redeem points error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
