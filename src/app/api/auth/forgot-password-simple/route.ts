import { NextRequest, NextResponse } from 'next/server'
import { otpStorage } from '@/lib/otp-storage'

const forgotPasswordSchema = {
  email: (val: string) => val.includes('@'),
  phone: (val: string) => val.length >= 10
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone } = body

    // Simple validation
    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Mohon isi email dan nomor HP' },
        { status: 400 }
      )
    }

    if (!forgotPasswordSchema.email(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    if (!forgotPasswordSchema.phone(phone)) {
      return NextResponse.json(
        { error: 'Nomor HP minimal 10 digit' },
        { status: 400 }
      )
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

    // Store OTP with email and phone as key
    otpStorage.set(`${email}-${phone}`, { otp, expiresAt, email, phone })

    // In production, send OTP via SMS and Email
    // For demo purposes, we'll log the OTP
    console.log(`[OTP] For ${email} (${phone}): ${otp}`)
    console.log(`[OTP] Valid until: ${new Date(expiresAt).toLocaleString('id-ID')}`)

    return NextResponse.json({
      message: 'OTP berhasil dikirim',
      expiresAt,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
