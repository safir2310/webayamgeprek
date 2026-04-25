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
    let matchedKey: string | null = null
    let matchedOtpData: any = null
    for (const [key, data] of allOtps.entries()) {
      if (data.otp === otp && Date.now() <= data.expiresAt) {
        matchedKey = key
        matchedOtpData = data
        break
      }
    }

    if (!matchedKey || !matchedOtpData) {
      return NextResponse.json(
        { error: 'Kode OTP salah atau kadaluarsa' },
        { status: 400 }
      )
    }

    // OTP is valid, allow password reset
    return NextResponse.json({
      message: 'OTP berhasil diverifikasi',
      email: matchedOtpData.email,
      phone: matchedOtpData.phone,
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
