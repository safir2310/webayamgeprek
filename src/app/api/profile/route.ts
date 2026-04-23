import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  avatar: z.string().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, name, email, phone, avatar } = updateProfileSchema.parse(body)

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if email is already taken by another user
    if (email !== existingUser.email) {
      const emailTaken = await db.user.findUnique({
        where: { email }
      })

      if (emailTaken) {
        return NextResponse.json(
          { error: 'Email sudah digunakan oleh user lain' },
          { status: 400 }
        )
      }
    }

    // Check if phone is already taken by another user
    if (phone !== existingUser.phone) {
      const phoneTaken = await db.user.findUnique({
        where: { phone }
      })

      if (phoneTaken) {
        return NextResponse.json(
          { error: 'Nomor telepon sudah digunakan oleh user lain' },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        avatar: avatar || existingUser.avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
      }
    })

    return NextResponse.json({
      user: updatedUser,
      message: 'Profile berhasil diperbarui'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId diperlukan' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
