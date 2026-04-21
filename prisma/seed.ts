import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ayamgeprek.com' },
    update: {},
    create: {
      name: 'Admin Utama',
      email: 'admin@ayamgeprek.com',
      phone: '081111111111',
      password: 'admin123',
      role: 'admin'
    }
  })
  console.log('Admin user created:', admin.email)

  // Create cashier user
  const cashier = await prisma.user.upsert({
    where: { email: 'kasir@ayamgeprek.com' },
    update: {},
    create: {
      name: 'Kasir 1',
      email: 'kasir@ayamgeprek.com',
      phone: '081222222222',
      password: 'kasir123',
      role: 'cashier'
    }
  })
  console.log('Cashier user created:', cashier.email)

  // Create categories
  const mainCategory = await prisma.category.upsert({
    where: { name: 'Main' },
    update: {},
    create: {
      name: 'Main',
      description: 'Menu Utama'
    }
  })

  const drinkCategory = await prisma.category.upsert({
    where: { name: 'Drink' },
    update: {},
    create: {
      name: 'Drink',
      description: 'Minuman'
    }
  })

  const snackCategory = await prisma.category.upsert({
    where: { name: 'Snack' },
    update: {},
    create: {
      name: 'Snack',
      description: 'Snack'
    }
  })

  console.log('Categories created')

  // Create products
  const products = [
    {
      name: 'Ayam Geprek Original',
      description: 'Ayam goreng crispy dengan sambal ijo pedas',
      price: 25000,
      stock: 50,
      image: '🍗',
      categoryId: mainCategory.id
    },
    {
      name: 'Ayam Geprek Keju',
      description: 'Ayam goreng crispy dengan sambal ijo dan keju',
      price: 30000,
      stock: 35,
      image: '🍗',
      categoryId: mainCategory.id
    },
    {
      name: 'Ayam Geprek Telur',
      description: 'Ayam goreng crispy dengan sambal ijo dan telur',
      price: 28000,
      stock: 40,
      image: '🍗',
      categoryId: mainCategory.id
    },
    {
      name: 'Nasi Geprek',
      description: 'Nasi dengan ayam geprek sambal ijo',
      price: 22000,
      stock: 45,
      image: '🍚',
      categoryId: mainCategory.id
    },
    {
      name: 'Es Teh Manis',
      description: 'Teh manis dingin segar',
      price: 8000,
      stock: 100,
      image: '🧊',
      categoryId: drinkCategory.id
    },
    {
      name: 'Es Jeruk',
      description: 'Jeruk peras dingin segar',
      price: 10000,
      stock: 80,
      image: '🍊',
      categoryId: drinkCategory.id
    },
    {
      name: 'Kopi Susu',
      description: 'Kopi susu gula aren',
      price: 15000,
      stock: 60,
      image: '☕',
      categoryId: drinkCategory.id
    },
    {
      name: 'Pisang Goreng',
      description: 'Pisang goreng crispy dengan gula pasir',
      price: 12000,
      stock: 70,
      image: '🍌',
      categoryId: snackCategory.id
    },
    {
      name: 'Tahu Crispy',
      description: 'Tahu goreng crispy dengan bumbu',
      price: 10000,
      stock: 65,
      image: '🥢',
      categoryId: snackCategory.id
    },
    {
      name: 'Tempe Mendoan',
      description: 'Tempe mendoan pedas',
      price: 10000,
      stock: 55,
      image: '🥢',
      categoryId: snackCategory.id
    }
  ]

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    })

    if (!existing) {
      await prisma.product.create({
        data: product
      })
    }
  }

  console.log('Products created')
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
