import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, password } = registerSchema.parse(body)

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingPhone = await db.user.findUnique({
      where: { phone },
    })

    if (existingPhone) {
      return NextResponse.json(
        { error: 'Nomor telepon sudah terdaftar' },
        { status: 400 }
      )
    }

    // Create user (In production, use bcrypt to hash password)
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        password,
        role: 'user',
      },
    })

    // Generate 6 digit member ID
    const memberId = String(Math.floor(100000 + Math.random() * 900000))

    // Create member record
    await db.member.create({
      data: {
        userId: user.id,
        memberId,
        points: 0,
        tier: 'regular',
        totalSpent: 0,
      },
    })

    return NextResponse.json({
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
