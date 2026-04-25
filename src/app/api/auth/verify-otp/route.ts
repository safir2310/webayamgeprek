import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { otpStorage } from '@/lib/otp-storage'

const verifyOtpSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  otp: z.string().length(4),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone, otp } = verifyOtpSchema.parse(body)

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

    // Verify OTP
    const isValid = otpStorage.verify(user.id, otp)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Kode OTP salah atau kadaluarsa' },
        { status: 400 }
      )
    }

    // Delete used OTP
    otpStorage.delete(user.id)

    return NextResponse.json({
      message: 'OTP berhasil diverifikasi',
      userId: user.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
