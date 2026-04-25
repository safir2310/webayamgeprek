#!/bin/bash

# Database Migration Script for Ayam Geprek Sambal Ijo

echo "🚀 Starting Database Migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo "Please set DATABASE_URL in .env file or environment"
  exit 1
fi

echo "📊 Database URL: ${DATABASE_URL:0:50}..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
bunx prisma generate

# Push schema to database
echo "⬆️  Pushing schema to database..."
bunx prisma db push

echo ""
echo "✅ Database migration completed successfully!"
echo ""
echo "📋 Summary:"
echo "  - Prisma Client generated"
echo "  - Schema pushed to database"
echo "  - All tables created/updated"
echo ""
