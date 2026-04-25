# Database Migration Guide

## Database Information

**Provider:** PostgreSQL (Neon)
**Connection:** Production database on Neon.tech

## Local Development

### Prerequisites
1. Install dependencies:
```bash
bun install
```

2. Set up environment variables in `.env`:
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Running Migrations

#### Development Migrations
To create and apply migrations during development:
```bash
bun run db:migrate
```

This will:
- Generate a new migration file based on schema changes
- Apply the migration to your database
- Update Prisma Client

#### Push Schema (Quick)
To quickly sync schema without creating migration files:
```bash
bun run db:push
```

#### Generate Prisma Client
To generate Prisma Client without migrations:
```bash
bun run db:generate
```

#### Reset Database
⚠️ **WARNING:** This will delete all data!
```bash
bun run db:reset
```

## Production Deployment

### Using Vercel

1. **Add Database URL to Vercel Environment Variables:**

   Go to Vercel Dashboard → Your Project → Settings → Environment Variables

   Add:
   ```
   DATABASE_URL=postgresql://neondb_owner:PASSWORD@ep-ancient-paper-aiifvyrx-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **Deployment Process:**

   Vercel automatically runs `bun run postinstall` after building, which generates Prisma Client.

   To manually apply migrations in production:
   ```bash
   bun run db:migrate:deploy
   ```

3. **Migration History:**

   Current migrations:
   - `20260425160316_init` - Initial schema with all tables

### Manual Migration Script

Use the `migrate.sh` script for manual migrations:

```bash
# Make script executable (if needed)
chmod +x migrate.sh

# Run migration
./migrate.sh
```

Or with bash:
```bash
bash migrate.sh
```

## Database Schema

### Tables Overview

**Authentication & Users:**
- `User` - User accounts (admin, cashier, customer)
- `Member` - Customer membership information

**Products & Categories:**
- `Category` - Product categories
- `Product` - Products with pricing, stock, images
- `FeaturedProduct` - Featured/unhighlighted products
- `StockLog` - Stock change history

**Orders & Transactions:**
- `Order` - Customer orders
- `OrderItem` - Items in orders
- `Transaction` - POS transactions
- `TransactionItem` - Items in POS transactions
- `Cart` - Shopping carts
- `CartItem` - Items in shopping carts
- `Payment` - Payment records
- `VoidLog` - Transaction void logs

**Promotions:**
- `Promo` - Promotional campaigns
- `Voucher` - Discount vouchers

**Management:**
- `Shift` - Cashier shifts
- `PaymentMethod` - Available payment methods
- `RedeemProduct` - Products redeemable with points
- `SalesReport` - Generated sales reports
- `Settings` - Application settings

**Communication:**
- `Notification` - User notifications
- `ChatMessage` - Customer support chat
- `WhatsAppMessage` - WhatsApp message logs

**Social:**
- `Favorite` - User's favorite products

### New Features

#### Feature Model (Added)
For managing latest features displayed in the app:

```prisma
model Feature {
  id          String   @id @default(cuid())
  title       String
  description String?
  icon        String?  // emoji or icon name
  badge       String?  // badge text (New, Hot, etc.)
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Troubleshooting

### Migration Conflicts

If you encounter migration conflicts:
1. Reset the migration history:
```bash
rm -rf prisma/migrations/*
bun run db:reset
bun run db:migrate
```

2. Or use force push:
```bash
bun run db:push
```

### Connection Issues

If you can't connect to Neon database:

1. Check your `.env` file has correct `DATABASE_URL`
2. Ensure `sslmode=require` is in the connection string
3. Verify your Neon project is active
4. Check network connectivity

### Prisma Client Issues

If Prisma Client is outdated:
```bash
bun run db:generate
```

## Environment Variables Required

```
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_SECRET           # NextAuth secret key
NEXTAUTH_URL             # NextAuth URL
```

## Security Notes

⚠️ **IMPORTANT:**

1. Never commit `.env` file to version control
2. Use `.env.example` as a template
3. Rotate database passwords regularly
4. Restrict database access to necessary IPs only
5. Use environment-specific databases (dev, staging, prod)

## Support

For issues with:
- **Prisma:** https://www.prisma.io/docs
- **Neon:** https://neon.tech/docs
- **Next.js:** https://nextjs.org/docs
