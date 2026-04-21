import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const shiftOpenSchema = z.object({
  cashierId: z.string(),
  openingCash: z.number().min(0),
})

// POST open shift
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cashierId, openingCash } = shiftOpenSchema.parse(body)

    // Check if cashier has an open shift
    const existingShift = await db.shift.findFirst({
      where: {
        cashierId,
        status: 'open',
      },
    })

    if (existingShift) {
      return NextResponse.json(
        { error: 'Kasir masih memiliki shift yang aktif' },
        { status: 400 }
      )
    }

    // Create shift
    const shift = await db.shift.create({
      data: {
        cashierId,
        openingCash,
        status: 'open',
      },
      include: {
        cashier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ shift }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Open shift error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
