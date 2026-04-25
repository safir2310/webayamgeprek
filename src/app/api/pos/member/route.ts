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

    // Search by phone number or member ID
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

// POST - Create new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email } = body

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : [])
        ]
      }
    })

    if (existingUser) {
      // Check if user already has a member record
      if (existingUser.id) {
        const existingMember = await db.member.findFirst({
          where: { userId: existingUser.id },
          include: { user: true }
        })

        if (existingMember) {
          return NextResponse.json({
            member: existingMember,
            user: {
              id: existingUser.id,
              name: existingUser.name,
              phone: existingUser.phone,
              email: existingUser.email
            }
          })
        }
      }
    }

    // Generate a 6-digit random member ID
    const generateMemberId = () => {
      const digits = Math.floor(100000 + Math.random() * 900000)
      return String(digits)
    }

    let memberId = generateMemberId()
    let memberExists = await db.member.findFirst({ where: { memberId } })

    // Ensure unique member ID
    while (memberExists) {
      memberId = generateMemberId()
      memberExists = await db.member.findFirst({ where: { memberId } })
    }

    // Create user if not exists
    let user = existingUser
    if (!user) {
      user = await db.user.create({
        data: {
          name,
          phone,
          email: email || `${phone}@temp.com`,
          password: 'member_temp_password', // Temporary password, member logs in with phone
          role: 'user'
        }
      })
    }

    // Check if member already exists for this user
    let member = await db.member.findFirst({
      where: { userId: user.id },
      include: { user: true }
    })

    if (member) {
      return NextResponse.json({
        member,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email
        }
      })
    }

    // Create member
    member = await db.member.create({
      data: {
        userId: user.id,
        memberId,
        points: 0,
        tier: 'regular',
        totalSpent: 0
      },
      include: { user: true }
    })

    return NextResponse.json({
      member,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}
