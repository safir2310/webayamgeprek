import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create default admin user
  const adminEmail = 'admin@ayamgeprek.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        phone: '6280000000001',
        password: 'admin123', // In production, use bcrypt
        role: 'admin',
      },
    })
    console.log('Created admin user:', admin.email)
  } else {
    console.log('Admin user already exists:', existingAdmin.email)
  }

  // Create default cashier user
  const cashierEmail = 'kasir@ayamgeprek.com'
  const existingCashier = await prisma.user.findUnique({
    where: { email: cashierEmail },
  })

  if (!existingCashier) {
    const cashier = await prisma.user.create({
      data: {
        name: 'Kasir Utama',
        email: cashierEmail,
        phone: '6280000000002',
        password: 'kasir123', // In production, use bcrypt
        role: 'cashier',
      },
    })
    console.log('Created cashier user:', cashier.email)
  } else {
    console.log('Cashier user already exists:', existingCashier.email)
  }

  // Create default payment methods
  const paymentMethods = [
    {
      name: 'cash',
      displayName: 'Cash',
      description: 'Bayar dengan uang tunai',
      icon: '💵',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'qris',
      displayName: 'QRIS',
      description: 'Bayar dengan QRIS',
      icon: '📱',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'transfer',
      displayName: 'Transfer Bank',
      description: 'Transfer ke rekening bank',
      icon: '🏦',
      isActive: true,
      sortOrder: 3,
    },
  ]

  for (const pm of paymentMethods) {
    const existingPM = await prisma.paymentMethod.findUnique({
      where: { name: pm.name },
    })

    if (!existingPM) {
      const createdPM = await prisma.paymentMethod.create({
        data: pm,
      })
      console.log('Created payment method:', createdPM.displayName)
    } else {
      console.log('Payment method already exists:', existingPM.displayName)
    }
  }

  // Create default redeem products
  const redeemProducts = [
    {
      name: 'Voucher Diskon 20%',
      description: 'Tukar 500 poin untuk voucher diskon 20%',
      points: 500,
      image: '🎟️',
      isActive: true,
      sortOrder: 1,
      stock: -1,
    },
    {
      name: 'Voucher Gratis Ongkir',
      description: 'Tukar 300 poin untuk voucher gratis ongkir',
      points: 300,
      image: '🚚',
      isActive: true,
      sortOrder: 2,
      stock: -1,
    },
    {
      name: 'Minuman Gratis',
      description: 'Tukar 400 poin untuk minuman gratis',
      points: 400,
      image: '🥤',
      isActive: true,
      sortOrder: 3,
      stock: 20,
    },
    {
      name: 'Makanan Tambahan',
      description: 'Tukar 600 poin untuk tambahan makanan',
      points: 600,
      image: '🍗',
      isActive: true,
      sortOrder: 4,
      stock: 10,
    },
    {
      name: 'Voucher Belanja 100K',
      description: 'Tukar 1000 poin untuk voucher belanja 100K',
      points: 1000,
      image: '💰',
      isActive: true,
      sortOrder: 5,
      stock: -1,
    },
  ]

  for (const rp of redeemProducts) {
    const existingRP = await prisma.redeemProduct.findFirst({
      where: { name: rp.name },
    })

    if (!existingRP) {
      const createdRP = await prisma.redeemProduct.create({
        data: rp,
      })
      console.log('Created redeem product:', createdRP.name)
    } else {
      console.log('Redeem product already exists:', existingRP.name)
    }
  }

  // Create sample categories
  const categories = [
    { name: 'Main Course', description: 'Menu utama' },
    { name: 'Drink', description: 'Minuman' },
    { name: 'Snack', description: 'Cemilan' },
  ]

  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: category.name },
    })

    if (!existingCategory) {
      const createdCategory = await prisma.category.create({
        data: category,
      })
      console.log('Created category:', createdCategory.name)
    } else {
      console.log('Category already exists:', existingCategory.name)
    }
  }

  // Get first category for products
  const firstCategory = await prisma.category.findFirst()

  if (firstCategory) {
    // Create sample products
    const products = [
      {
        name: 'Ayam Geprek Original',
        description: 'Ayam goreng crispy dengan sambal ijo pedas',
        price: 25000,
        stock: 50,
        barcode: 'AYAM001',
        categoryId: firstCategory.id,
      },
      {
        name: 'Ayam Geprek Keju',
        description: 'Ayam goreng crispy dengan sambal ijo dan keju',
        price: 30000,
        stock: 35,
        barcode: 'AYAM002',
        categoryId: firstCategory.id,
      },
      {
        name: 'Nasi Geprek',
        description: 'Nasi dengan ayam geprek sambal ijo',
        price: 22000,
        stock: 45,
        barcode: 'NASI001',
        categoryId: firstCategory.id,
      },
    ]

    for (const product of products) {
      const existingProduct = await prisma.product.findFirst({
        where: { barcode: product.barcode },
      })

      if (!existingProduct) {
        const createdProduct = await prisma.product.create({
          data: product,
        })
        console.log('Created product:', createdProduct.name)
      } else {
        console.log('Product already exists:', existingProduct.name)
      }
    }
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
