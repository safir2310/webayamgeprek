import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const forgotPasswordVerifySchema = z.object({
  email: z.string().email('Format email tidak valid'),
  phoneLast4: z.string().length(4, 'Harap masukkan 4 digit terakhir nomor HP'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phoneLast4 } = forgotPasswordVerifySchema.parse(body)

    // Find user by email
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

    // User verified successfully
    return NextResponse.json({
      message: 'Verifikasi berhasil',
      email: user.email,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Forgot password verify error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
