import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const resetPasswordWithPhoneSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  phoneLast4: z.string().length(4, 'Harap masukkan 4 digit terakhir nomor HP'),
  newPassword: z.string().min(6, 'Password minimal 6 karakter'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phoneLast4, newPassword } = resetPasswordWithPhoneSchema.parse(body)

    // Find user by email and verify last 4 digits of phone
    const user = await db.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if the last 4 digits of phone match
    const userPhoneLast4 = user.phone.slice(-4)
    if (userPhoneLast4 !== phoneLast4) {
      return NextResponse.json(
        { error: '4 digit terakhir nomor HP tidak cocok' },
        { status: 400 }
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
