import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const changePasswordSchema = z.object({
  userId: z.string(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, currentPassword, newPassword } = changePasswordSchema.parse(body)

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return NextResponse.json(
        { error: 'Password saat ini salah' },
        { status: 400 }
      )
    }

    // Check if new password is same as current password
    if (user.password === newPassword) {
      return NextResponse.json(
        { error: 'Password baru tidak boleh sama dengan password saat ini' },
        { status: 400 }
      )
    }

    // Update password
    await db.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
      }
    })

    return NextResponse.json({
      message: 'Password berhasil diubah'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
