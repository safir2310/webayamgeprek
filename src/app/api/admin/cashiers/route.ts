import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const cashiers = await db.user.findMany({
      where: { role: 'cashier' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ cashiers })
  } catch (error) {
    console.error('Cashiers API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cashiers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    const cashier = await db.user.create({
      data: {
        name,
        email,
        phone,
        password,
        role: 'cashier'
      }
    })

    return NextResponse.json({ cashier })
  } catch (error) {
    console.error('Create cashier error:', error)
    return NextResponse.json(
      { error: 'Failed to create cashier' },
      { status: 500 }
    )
  }
}
