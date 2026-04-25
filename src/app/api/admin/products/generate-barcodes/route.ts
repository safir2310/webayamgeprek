import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    // Get all products without barcode
    const productsWithoutBarcode = await db.product.findMany({
      where: {
        barcode: null,
        isActive: true
      }
    })

    if (productsWithoutBarcode.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All products already have barcodes',
        count: 0
      })
    }

    // Generate unique barcodes for each product
    const updatedProducts = []

    for (const product of productsWithoutBarcode) {
      // Generate unique 12-digit barcode
      let barcode: string
      let isUnique = false
      let attempts = 0

      while (!isUnique && attempts < 10) {
        // Generate barcode with prefix based on category (last digit of category)
        const prefix = String(product.categoryId.slice(-1))
        const randomPart = String(Math.floor(100000000 + Math.random() * 900000000))
        barcode = prefix + randomPart // 10 digits total

        // Check if barcode is unique
        const existing = await db.product.findUnique({
          where: { barcode }
        })

        if (!existing) {
          isUnique = true
        }

        attempts++
      }

      if (!isUnique) {
        console.error(`Failed to generate unique barcode for product ${product.id}`)
        continue
      }

      // Update product with barcode
      const updated = await db.product.update({
        where: { id: product.id },
        data: { barcode }
      })

      updatedProducts.push(updated)
    }

    return NextResponse.json({
      success: true,
      message: `Generated barcodes for ${updatedProducts.length} products`,
      count: updatedProducts.length,
      products: updatedProducts
    })
  } catch (error) {
    console.error('Error generating barcodes:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate barcodes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PATCH to regenerate barcode for a specific product
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get product
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { category: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Generate unique barcode
    let barcode: string
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      const prefix = String(product.categoryId.slice(-1))
      const randomPart = String(Math.floor(100000000 + Math.random() * 900000000))
      barcode = prefix + randomPart

      const existing = await db.product.findFirst({
        where: {
          barcode,
          NOT: { id: productId }
        }
      })

      if (!existing) {
        isUnique = true
      }

      attempts++
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique barcode after multiple attempts' },
        { status: 500 }
      )
    }

    // Update product with new barcode
    const updated = await db.product.update({
      where: { id: productId },
      data: { barcode }
    })

    return NextResponse.json({
      success: true,
      message: 'Barcode regenerated successfully',
      product: updated
    })
  } catch (error) {
    console.error('Error regenerating barcode:', error)
    return NextResponse.json(
      {
        error: 'Failed to regenerate barcode',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
