import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { otpStorage } from '@/lib/otp-storage'
import { db } from '@/lib/db'

const resetPasswordSchema = z.object({
  otp: z.string().length(4),
  newPassword: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { otp, newPassword } = resetPasswordSchema.parse(body)

    // Find OTP data
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

    // Find user by email and phone
    const user = await db.user.findFirst({
      where: {
        email: matchedOtpData.email,
        phone: matchedOtpData.phone,
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

    // Delete used OTP
    otpStorage.delete(matchedKey)

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
