import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Seed Categories
  const existingCategories = await prisma.category.findMany()
  if (existingCategories.length === 0) {
    console.log('Seeding categories...')
    const categories = await prisma.category.createMany({
      data: [
        {
          name: 'Main',
          description: 'Menu utama ayam geprek',
          image: '🍗'
        },
        {
          name: 'Drink',
          description: 'Minuman segar',
          image: '🥤'
        },
        {
          name: 'Snack',
          description: 'Camilan lezat',
          image: '🍟'
        }
      ]
    })
    console.log(`✅ ${categories.count} categories seeded`)
  } else {
    console.log('ℹ️ Categories already exist, skipping...')
  }

  // Seed Products
  const existingProducts = await prisma.product.findMany()
  if (existingProducts.length === 0) {
    console.log('Seeding products...')

    // Get category IDs
    const mainCategory = await prisma.category.findFirst({ where: { name: 'Main' } })
    const drinkCategory = await prisma.category.findFirst({ where: { name: 'Drink' } })
    const snackCategory = await prisma.category.findFirst({ where: { name: 'Snack' } })

    await prisma.product.createMany({
      data: [
        {
          name: 'Ayam Geprek Original',
          description: 'Ayam goreng crispy dengan sambal ijo pedas',
          price: 25000,
          stock: 50,
          image: '🍗',
          categoryId: mainCategory?.id || '',
          isActive: true
        },
        {
          name: 'Ayam Geprek Keju',
          description: 'Ayam geprek dengan topping keju melimpah',
          price: 30000,
          stock: 45,
          image: '🧀',
          categoryId: mainCategory?.id || '',
          isActive: true
        },
        {
          name: 'Ayam Geprek Telur',
          description: 'Ayam geprek dengan telur mata sapi',
          price: 28000,
          stock: 40,
          image: '🥚',
          categoryId: mainCategory?.id || '',
          isActive: true
        },
        {
          name: 'Ayam Geprek Jumbo',
          description: 'Porsi jumbo 2 potong ayam dengan sambal ijo',
          price: 40000,
          stock: 30,
          image: '🍗🍗',
          categoryId: mainCategory?.id || '',
          isActive: true
        },
        {
          name: 'Es Teh Manis',
          description: 'Teh manis dingin segar',
          price: 5000,
          stock: 100,
          image: '🧊',
          categoryId: drinkCategory?.id || '',
          isActive: true
        },
        {
          name: 'Es Jeruk',
          description: 'Jus jeruk segar dengan es',
          price: 7000,
          stock: 80,
          image: '🍊',
          categoryId: drinkCategory?.id || '',
          isActive: true
        },
        {
          name: 'Es Campur',
          description: 'Campuran buah segar dengan sirup merah',
          price: 12000,
          stock: 60,
          image: '🍧',
          categoryId: drinkCategory?.id || '',
          isActive: true
        },
        {
          name: 'Kentang Goreng',
          description: 'Kentang goreng renyah dengan bumbu',
          price: 8000,
          stock: 70,
          image: '🍟',
          categoryId: snackCategory?.id || '',
          isActive: true
        },
        {
          name: 'Risoles Mayo',
          description: 'Risoles dengan isian mayones dan telur',
          price: 6000,
          stock: 50,
          image: '🌯',
          categoryId: snackCategory?.id || '',
          isActive: true
        },
        {
          name: 'Pisang Goreng',
          description: 'Pisang goreng renyah dengan topping coklat',
          price: 10000,
          stock: 40,
          image: '🍌',
          categoryId: snackCategory?.id || '',
          isActive: true
        }
      ]
    })
    console.log('✅ Products seeded')
  } else {
    console.log('ℹ️ Products already exist, skipping...')
  }

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
