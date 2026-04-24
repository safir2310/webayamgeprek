import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/payment-methods - Get all payment methods
export async function GET() {
  try {
    const paymentMethods = await db.paymentMethod.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ paymentMethods })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}

// POST /api/payment-methods - Create payment method (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, displayName, description, icon, isActive, sortOrder } = body

    // Validate required fields
    if (!name || !displayName) {
      return NextResponse.json(
        { error: 'Name and displayName are required' },
        { status: 400 }
      )
    }

    // Check if name already exists
    const existing = await db.paymentMethod.findUnique({
      where: { name }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Payment method with this name already exists' },
        { status: 400 }
      )
    }

    const paymentMethod = await db.paymentMethod.create({
      data: {
        name,
        displayName,
        description,
        icon,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0
      }
    })

    return NextResponse.json({ paymentMethod }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment method:', error)
    return NextResponse.json(
      { error: 'Failed to create payment method' },
      { status: 500 }
    )
  }
}
