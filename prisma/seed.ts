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
