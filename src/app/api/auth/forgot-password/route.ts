import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { otpStorage } from '@/lib/otp-storage'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone } = forgotPasswordSchema.parse(body)

    // Find user by email and phone
    const user = await db.user.findFirst({
      where: {
        email,
        phone,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email atau nomor HP tidak terdaftar' },
        { status: 404 }
      )
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

    // Store OTP
    otpStorage.set(user.id, { otp, expiresAt, email, phone, userId: user.id })

    // In production, send OTP via SMS and Email
    // For demo purposes, we'll log the OTP
    console.log(`[OTP] For user ${user.email} (${user.phone}): ${otp}`)

    return NextResponse.json({
      message: 'OTP berhasil dikirim',
      expiresAt,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
