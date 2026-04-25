#!/bin/bash

echo "🔌 Verifikasi Koneksi Database Neon PostgreSQL"
echo "=========================================="
echo ""

# Cek .env
if [ ! -f .env ]; then
  echo "❌ File .env tidak ditemukan!"
  exit 1
fi

# Load DATABASE_URL
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

echo "📍 DATABASE_URL: ${DATABASE_URL:0:60}..."
echo ""

# Cek koneksi dengan bun
echo "🧪 Menguji koneksi database..."
bun run test-db-connection.ts

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Database NEON POSTGRESQL TERAHUBUNG!"
  echo ""
  echo "📊 Informasi Database:"
  echo "   - Provider: PostgreSQL"
  echo "   - Host: ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech"
  echo "   - Database: neondb"
  echo "   - Schema: public"
  echo ""
  echo "🎉 Siap untuk deployment ke production!"
else
  echo ""
  echo "❌ Koneksi database gagal!"
  echo ""
  echo "Troubleshooting:"
  echo "1. Cek koneksi internet"
  echo "2. Verifikasi DATABASE_URL di file .env"
  echo "3. Pastikan database Neon aktif di console.neon.tech"
  echo "4. Reset password database jika perlu"
  exit 1
fi
