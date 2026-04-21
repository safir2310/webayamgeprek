import { NextResponse } from 'next/server'

export async function POST() {
  // In production with JWT or NextAuth.js, handle token invalidation
  return NextResponse.json({
    message: 'Logout berhasil',
  })
}
