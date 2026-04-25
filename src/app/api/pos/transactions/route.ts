import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all transactions
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const transactions = await db.transaction.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                barcode: true,
              }
            }
          }
        },
        shift: {
          select: {
            id: true,
            cashierId: true,
            openedAt: true,
            closedAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST create new transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
      customerName,
      customerPhone,
      memberId,
      cashierId,
      shiftId,
      note
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Item pesanan harus ada' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Metode pembayaran harus dipilih' },
        { status: 400 }
      )
    }

    // Generate transaction number
    const date = new Date()
    const prefix = `TRX${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
    const random = Math.floor(Math.random() * 9000) + 1000
    const transactionNumber = `${prefix}-${random}`

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        transactionNumber,
        subtotal,
        tax: 0,
        discount,
        total,
        paymentMethod,
        status: 'completed',
        note,
        ...(shiftId && { shiftId }),
        ...(cashierId && { cashierId }),
      }
    })

    // Create transaction items
    for (const item of items) {
      await db.transactionItem.create({
        data: {
          transactionId: transaction.id,
          productId: item.product.id,
          qty: item.qty,
          price: item.product.price,
          subtotal: item.product.price * item.qty,
        }
      })

      // Update product stock
      await db.product.update({
        where: { id: item.product.id },
        data: {
          stock: {
            decrement: item.qty
          }
        }
      })

      // Create stock log
      await db.stockLog.create({
        data: {
          productId: item.product.id,
          qty: -item.qty,
          type: 'sale',
          reason: `Transaksi ${transactionNumber}`,
        }
      })
    }

    // If member exists, update member points and total spent
    if (memberId) {
      const member = await db.member.findFirst({
        where: { memberId },
        include: { user: true }
      })

      if (member) {
        // Calculate points: 1% of total spent
        const earnedPoints = Math.floor(total * 0.01)

        await db.member.update({
          where: { id: member.id },
          data: {
            points: {
              increment: earnedPoints
            },
            totalSpent: {
              increment: total
            }
          }
        })

        // Update tier based on total spent
        let newTier = 'regular'
        if (member.totalSpent + total >= 500000) {
          newTier = 'platinum'
        } else if (member.totalSpent + total >= 200000) {
          newTier = 'gold'
        } else if (member.totalSpent + total >= 50000) {
          newTier = 'silver'
        }

        if (newTier !== member.tier) {
          await db.member.update({
            where: { id: member.id },
            data: { tier: newTier }
          })
        }
      }
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
