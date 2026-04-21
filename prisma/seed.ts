import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@ayamgeprek.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'demo@ayamgeprek.com',
      phone: '081234567890',
      password: 'demo123',
      role: 'user',
    },
  })

  // Generate 6 digit member ID
  const memberId = String(Math.floor(100000 + Math.random() * 900000))

  // Create member record
  await prisma.member.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      memberId,
      points: 150,
      tier: 'regular',
      totalSpent: 500000,
    },
  })

  console.log('Seeding finished.')
  console.log('Email: demo@ayamgeprek.com')
  console.log('Password: demo123')
  console.log('Member ID:', memberId)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
