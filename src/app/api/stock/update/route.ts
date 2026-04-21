import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const stockUpdateSchema = z.object({
  productId: z.string(),
  qty: z.number(),
  type: z.enum(['restock', 'sale', 'void', 'adjustment']),
  reason: z.string().optional(),
})

// POST update stock
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = stockUpdateSchema.parse(body)

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: data.productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update product stock
    const updatedProduct = await db.product.update({
      where: { id: data.productId },
      data: {
        stock: {
          increment: data.qty,
        },
      },
    })

    // Create stock log
    await db.stockLog.create({
      data: {
        productId: data.productId,
        qty: data.qty,
        type: data.type,
        reason: data.reason,
      },
    })

    return NextResponse.json({
      product: updatedProduct,
      message: 'Stok berhasil diperbarui',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update stock error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
