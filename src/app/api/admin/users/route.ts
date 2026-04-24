import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

function decodeToken(token: string) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  role: z.enum(['user', 'cashier', 'admin']),
})

export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const data = createUserSchema.parse(body)

    // Check if existing user with same email or phone
    const existingEmail = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    const existingPhone = await db.user.findUnique({
      where: { phone: data.phone },
    })

    if (existingPhone) {
      return NextResponse.json(
        { error: 'Nomor telepon sudah terdaftar' },
        { status: 400 }
      )
    }

    // Create user
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password, // In production, use bcrypt
        role: data.role,
      },
    })

    // Create member record if user is regular user
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

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
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

    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
