import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  barcode: z.string().optional(),
  image: z.string().optional(),
  categoryId: z.string(),
})

// GET all products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    const products = await db.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST create product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = productSchema.parse(body)

    const product = await db.product.create({
      data,
      include: {
        category: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
