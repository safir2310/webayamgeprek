import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const addPointSchema = z.object({
  userId: z.string(),
  points: z.number().int().positive(),
  amount: z.number().positive(),
})

// POST add points
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, points, amount } = addPointSchema.parse(body)

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

    // Calculate new totals
    const newPoints = member.points + points
    const newTotalSpent = member.totalSpent + amount

    // Calculate tier based on total spent
    let tier = 'regular'
    if (newTotalSpent >= 5000000) tier = 'platinum'
    else if (newTotalSpent >= 2000000) tier = 'gold'
    else if (newTotalSpent >= 500000) tier = 'silver'

    // Update member
    const updatedMember = await db.member.update({
      where: { userId },
      data: {
        points: newPoints,
        totalSpent: newTotalSpent,
        tier,
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json({ member: updatedMember })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Add points error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
