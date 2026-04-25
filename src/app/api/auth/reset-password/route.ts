import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  newPassword: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone, newPassword } = resetPasswordSchema.parse(body)

    // Find user by email and phone
    const user = await db.user.findFirst({
      where: {
        email,
        phone,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update password
    await db.user.update({
      where: { id: user.id },
      data: { password: newPassword },
    })

    return NextResponse.json({
      message: 'Password berhasil direset',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
