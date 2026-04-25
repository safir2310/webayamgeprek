import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { otpStorage } from '@/lib/otp-storage'

const verifyOtpSchema = z.object({
  otp: z.string().length(4),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { otp } = verifyOtpSchema.parse(body)

    // Verify OTP against all stored OTPs
    const allOtps = otpStorage.getAll()

    // Find matching OTP
    let matchedUserId: string | null = null
    for (const [userId, data] of allOtps.entries()) {
      if (data.otp === otp && Date.now() <= data.expiresAt) {
        matchedUserId = userId
        break
      }
    }

    if (!matchedUserId) {
      return NextResponse.json(
        { error: 'Kode OTP salah atau kadaluarsa' },
        { status: 400 }
      )
    }

    // OTP is valid, allow password reset
    // Store the verified user ID in a temporary way
    // For simplicity, we'll use the otpStorage to mark this OTP as verified for password reset
    return NextResponse.json({
      message: 'OTP berhasil diverifikasi',
      userId: matchedUserId,
      email: allOtps.get(matchedUserId)?.email,
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
