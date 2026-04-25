import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Search member by phone or member ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')?.trim()

    if (!search) {
      return NextResponse.json(
        { error: 'Search parameter is required' },
        { status: 400 }
      )
    }

    // Search by phone number or email
    const user = await db.user.findFirst({
      where: {
        OR: [
          { phone: search },
          { email: search }
        ]
      },
      include: {
        member: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { member: null },
        { status: 200 }
      )
    }

    return NextResponse.json({
      member: user.member,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error searching member:', error)
    return NextResponse.json(
      { error: 'Failed to search member' },
      { status: 500 }
    )
  }
}
