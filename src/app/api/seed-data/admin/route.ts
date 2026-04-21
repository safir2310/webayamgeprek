import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action = 'seed' } = body

    // Seed Admin Data
    if (action === 'seed') {
      // Check if admin exists
      const existingAdmin = await db.user.findFirst({
        where: { role: 'admin' }
      })

      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Admin already exists', admin: existingAdmin },
          { status: 400 }
        )
      }

      // Hash passwords
      const adminPassword = await bcrypt.hash('admin123', 10)
      const cashierPassword = await bcrypt.hash('kasir123', 10)

      // Create Admin
      const admin = await db.user.create({
        data: {
          name: 'Administrator',
          email: 'admin@ayamgeprek.com',
          phone: '08123456789',
          password: adminPassword,
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
        }
      })

      // Create Cashier
      const cashier = await db.user.create({
        data: {
          name: 'Kasir Utama',
          email: 'kasir@ayamgeprek.com',
          phone: '08129876543',
          password: cashierPassword,
          role: 'cashier',
          avatar: 'https://ui-avatars.com/api/?name=Kasir&background=4CAF50&color=fff'
        }
      })

      return NextResponse.json({
        message: 'Admin and cashier data seeded successfully',
        data: {
          admin: {
            email: admin.email,
            password: 'admin123',
            phone: admin.phone,
            name: admin.name
          },
          cashier: {
            email: cashier.email,
            password: 'kasir123',
            phone: cashier.phone,
            name: cashier.name
          }
        }
      }, { status: 201 })
    }

    // Reset admin data
    if (action === 'reset') {
      // Delete existing admin and cashier
      await db.user.deleteMany({
        where: {
          role: {
            in: ['admin', 'cashier']
          }
        }
      })

      // Create new admin and cashier
      const adminPassword = await bcrypt.hash('admin123', 10)
      const cashierPassword = await bcrypt.hash('kasir123', 10)

      const admin = await db.user.create({
        data: {
          name: 'Administrator',
          email: 'admin@ayamgeprek.com',
          phone: '08123456789',
          password: adminPassword,
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
        }
      })

      const cashier = await db.user.create({
        data: {
          name: 'Kasir Utama',
          email: 'kasir@ayamgeprek.com',
          phone: '08129876543',
          password: cashierPassword,
          role: 'cashier',
          avatar: 'https://ui-avatars.com/api/?name=Kasir&background=4CAF50&color=fff'
        }
      })

      return NextResponse.json({
        message: 'Admin and cashier data reset successfully',
        data: {
          admin: {
            email: admin.email,
            password: 'admin123',
            phone: admin.phone,
            name: admin.name
          },
          cashier: {
            email: cashier.email,
            password: 'kasir123',
            phone: cashier.phone,
            name: cashier.name
          }
        }
      }, { status: 200 })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in admin seed API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const admin = await db.user.findFirst({
      where: { role: 'admin' }
    })

    const cashier = await db.user.findFirst({
      where: { role: 'cashier' }
    })

    return NextResponse.json({
      adminExists: !!admin,
      cashierExists: !!cashier,
      admin: admin ? {
        email: admin.email,
        name: admin.name,
        phone: admin.phone
      } : null,
      cashier: cashier ? {
        email: cashier.email,
        name: cashier.name,
        phone: cashier.phone
      } : null
    })
  } catch (error) {
    console.error('Error checking admin data:', error)
    return NextResponse.json(
      { error: 'Failed to check admin data' },
      { status: 500 }
    )
  }
}
