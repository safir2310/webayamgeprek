import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Seed Payment Methods
  const existingPaymentMethods = await prisma.paymentMethod.findMany()
  if (existingPaymentMethods.length === 0) {
    console.log('Seeding payment methods...')
    await prisma.paymentMethod.createMany({
      data: [
        {
          name: 'cash',
          displayName: 'Cash',
          description: 'Bayar tunai di kasir',
          icon: '💵',
          isActive: true,
          sortOrder: 1
        },
        {
          name: 'qris',
          displayName: 'QRIS',
          description: 'Scan QR code untuk pembayaran',
          icon: '📱',
          isActive: true,
          sortOrder: 2
        },
        {
          name: 'transfer',
          displayName: 'Transfer Bank',
          description: 'Transfer ke rekening bank',
          icon: '🏦',
          isActive: true,
          sortOrder: 3
        }
      ]
    })
    console.log('✅ Payment methods seeded')
  } else {
    console.log('ℹ️ Payment methods already exist, skipping...')
  }

  // Seed Redeem Products
  const existingRedeemProducts = await prisma.redeemProduct.findMany()
  if (existingRedeemProducts.length === 0) {
    console.log('Seeding redeem products...')
    await prisma.redeemProduct.createMany({
      data: [
        {
          name: 'Diskon Rp 10.000',
          description: 'Voucher diskon Rp 10.000 untuk pesanan apa saja',
          points: 100,
          image: '🎟️',
          isActive: true,
          sortOrder: 1,
          stock: 50
        },
        {
          name: 'Diskon 20%',
          description: 'Voucher diskon 20% maksimal Rp 30.000',
          points: 250,
          image: '🎁',
          isActive: true,
          sortOrder: 2,
          stock: 30
        },
        {
          name: 'Gratis Minuman',
          description: 'Dapatkan 1 minuman gratis untuk pesanan minimal Rp 50.000',
          points: 200,
          image: '🥤',
          isActive: true,
          sortOrder: 3,
          stock: 25
        },
        {
          name: 'Paket Hemat',
          description: 'Diskon Rp 25.000 untuk pesanan minimal Rp 100.000',
          points: 400,
          image: '🎫',
          isActive: true,
          sortOrder: 4,
          stock: 20
        },
        {
          name: 'Menu Spesial',
          description: 'Tukarkan untuk menu spesial Ayam Geprek Sambal Ijo',
          points: 500,
          image: '🍗',
          isActive: true,
          sortOrder: 5,
          stock: -1 // Unlimited
        },
        {
          name: 'Voucher Ulang Tahun',
          description: 'Diskon 50% untuk merayakan ulang tahun Anda',
          points: 1000,
          image: '🎂',
          isActive: true,
          sortOrder: 6,
          stock: 10
        }
      ]
    })
    console.log('✅ Redeem products seeded')
  } else {
    console.log('ℹ️ Redeem products already exist, skipping...')
  }

  console.log('Seed completed! 🎉')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
