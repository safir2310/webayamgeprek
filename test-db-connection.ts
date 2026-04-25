import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')

    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')

    // Check which tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log('📋 Tables in database:')
    console.log('  ', tables)

    // Check database provider
    const result = await prisma.$queryRaw`SELECT version()` as any
    console.log('🗄️  Database version:', result[0]?.version)

    // Test simple query
    const userCount = await prisma.user.count()
    console.log('👥 Users in database:', userCount)

    const categoryCount = await prisma.category.count()
    console.log('📂 Categories in database:', categoryCount)

    await prisma.$disconnect()
    console.log('✅ Database connection test completed!')

  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error)
    process.exit(1)
  }
}

testDatabaseConnection()
