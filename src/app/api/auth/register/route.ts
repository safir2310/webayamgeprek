import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  role: z.enum(['user', 'cashier', 'admin']).default('user'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existingPhone = await db.user.findUnique({
      where: { phone: data.phone },
    })

    if (existingPhone) {
      return NextResponse.json(
        { error: 'Nomor telepon sudah terdaftar' },
        { status: 400 }
      )
    }

    // In production, use bcrypt to hash password
    const hashedPassword = data.password

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role,
      },
    })

    // Create member record if user is not admin or cashier
    if (data.role === 'user') {
      await db.member.create({
        data: {
          userId: user.id,
          memberId: Math.floor(100000 + Math.random() * 900000).toString(),
          points: 0,
          tier: 'regular',
        },
      })
    }

    // In production, use JWT or NextAuth.js
    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64')

    return NextResponse.json({
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
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
