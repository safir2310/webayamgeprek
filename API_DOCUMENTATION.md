# 🍗 Ayam Geprek Sambal Ijo - Restaurant Management System

A complete Next.js 16 restaurant management system with mobile app-style UI, POS system, and comprehensive APIs.

## 🚀 Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **State Management**: React Hooks
- **Validation**: Zod

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product management
│   │   ├── categories/   # Category management
│   │   ├── cart/         # Shopping cart
│   │   ├── orders/       # Order management
│   │   ├── payments/     # Payment processing (QRIS)
│   │   ├── transactions/ # POS transactions
│   │   ├── shifts/       # Cashier shift management
│   │   ├── stock/        # Stock management
│   │   ├── members/      # Member loyalty
│   │   ├── void/         # Transaction voiding
│   │   ├── whatsapp/     # WhatsApp notifications
│   │   └── dashboard/    # Analytics dashboard
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   └── page.tsx          # Main application page
├── lib/
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utility functions
└── prisma/
    └── schema.prisma     # Database schema
```

## 🎨 UI Screens

The application includes 10 mobile app-style screens:

1. **Splash Screen** - Welcome screen with logo
2. **Login Screen** - User authentication
3. **Register Screen** - New user registration
4. **Home Screen** - Main dashboard with promos and quick actions
5. **Menu Screen** - Product catalog with search and filtering
6. **Cart Screen** - Shopping cart with voucher and points
7. **Checkout Screen** - Payment method selection
8. **Order Status Screen** - Order tracking timeline
9. **Account Screen** - User profile and settings
10. **POS Screen** - Point of Sale system for cashiers
11. **Shift Screen** - Cashier shift management

## 📡 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "base64token",
  "role": "user",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "08123456789",
    "avatar": null
  }
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "08123456789",
  "password": "password123"
}
```

#### Logout
```http
POST /api/auth/logout
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Products

#### Get All Products
```http
GET /api/products?categoryId=cat_id&search=keyword
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Ayam Geprek",
  "description": "Ayam goreng dengan sambal",
  "price": 25000,
  "stock": 50,
  "barcode": "1234567890",
  "image": "image_url",
  "categoryId": "category_id"
}
```

#### Update Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 30000
}
```

#### Delete Product
```http
DELETE /api/products/:id
```

### Categories

#### Get All Categories
```http
GET /api/categories
```

#### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Main Course",
  "description": "Main dishes",
  "image": "image_url"
}
```

#### Update Category
```http
PUT /api/categories/:id
```

#### Delete Category
```http
DELETE /api/categories/:id
```

### Cart

#### Get User Cart
```http
GET /api/cart?userId=user_id
```

#### Add to Cart
```http
POST /api/cart
Content-Type: application/json

{
  "userId": "user_id",
  "productId": "product_id",
  "qty": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/:id
Content-Type: application/json

{
  "qty": 3
}
```

#### Delete Cart Item
```http
DELETE /api/cart/:id
```

### Orders

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "userId": "user_id",
  "address": "Delivery address",
  "note": "Special instructions",
  "paymentMethod": "qris",
  "items": [
    {
      "productId": "product_id",
      "qty": 2,
      "price": 25000
    }
  ]
}
```

#### Get User Orders
```http
GET /api/orders/user?userId=user_id
```

#### Get All Orders (Admin)
```http
GET /api/orders/admin?status=processing
```

#### Update Order Status
```http
PUT /api/orders/status/:id
Content-Type: application/json

{
  "status": "processing"
}
```

Status values: `pending`, `paid`, `processing`, `completed`, `cancelled`

### Payments (QRIS)

#### Create QRIS Payment
```http
POST /api/payments/qris
Content-Type: application/json

{
  "orderId": "order_id",
  "amount": 50000
}
```

Response:
```json
{
  "qrCode": "QRIS-code-data",
  "invoiceId": "INV1234567890",
  "amount": 50000,
  "paymentId": "payment_id"
}
```

#### Payment Callback
```http
POST /api/payments/callback
Content-Type: application/json

{
  "invoiceId": "INV1234567890",
  "status": "success",
  "amount": 50000,
  "callbackData": {}
}
```

### Transactions (POS)

#### Get All Transactions
```http
GET /api/transactions?shiftId=shift_id&cashierId=cashier_id&startDate=2024-01-01&endDate=2024-12-31
```

#### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
  "shiftId": "shift_id",
  "cashierId": "cashier_id",
  "paymentMethod": "cash",
  "note": "Customer note",
  "items": [
    {
      "productId": "product_id",
      "qty": 2,
      "price": 25000
    }
  ]
}
```

### Shifts

#### Open Shift
```http
POST /api/shifts/open
Content-Type: application/json

{
  "cashierId": "cashier_id",
  "openingCash": 500000
}
```

#### Close Shift
```http
POST /api/shifts/close
Content-Type: application/json

{
  "cashierId": "cashier_id",
  "closingCash": 750000
}
```

### Stock

#### Update Stock
```http
POST /api/stock/update
Content-Type: application/json

{
  "productId": "product_id",
  "qty": 100,
  "type": "restock",
  "reason": "Restock from supplier"
}
```

Type values: `restock`, `sale`, `void`, `adjustment`

### Member Points

#### Get Member by Phone
```http
GET /api/members/:phone
```

#### Add Points
```http
POST /api/members/point/add
Content-Type: application/json

{
  "userId": "user_id",
  "points": 100,
  "amount": 100000
}
```

#### Redeem Points
```http
POST /api/members/point/redeem
Content-Type: application/json

{
  "userId": "user_id",
  "points": 500
}
```

### Void Transaction

```http
POST /api/void
Content-Type: application/json

{
  "transactionId": "transaction_id",
  "reason": "Customer request",
  "supervisorPin": "1234"
}
```

### WhatsApp

#### Send Message
```http
POST /api/whatsapp/send
Content-Type: application/json

{
  "phone": "628123456789",
  "message": "Your order is ready!",
  "type": "order"
}
```

Type values: `order`, `payment`, `shift`, `stock`

### Dashboard Analytics

#### Today's Sales
```http
GET /api/dashboard/today
```

Response:
```json
{
  "date": "2024-01-01T00:00:00.000Z",
  "totalSales": 1500000,
  "totalOrders": 25,
  "totalOnlineOrders": 10,
  "totalOnlineSales": 500000,
  "paymentMethods": {
    "cash": 1000000,
    "qris": 400000,
    "transfer": 100000
  },
  "transactions": 15
}
```

#### Week's Sales
```http
GET /api/dashboard/week
```

#### Month's Sales
```http
GET /api/dashboard/month
```

#### Best Selling Products
```http
GET /api/dashboard/best-product?period=week
```

Period values: `today`, `week`, `month`, `all`

## 🎨 UI Design Standards

- **Color Theme**: Orange (#f97316) primary, no blue/indigo
- **Border Radius**: 16px (rounded-xl)
- **Padding**: 16px standard
- **Gap**: 12px
- **Font**: Inter
- **Icon Set**: Lucide React
- **Animations**: Fade, slide up, scale hover, center popup zoom

## 📱 Responsive Design

- **Mobile-First**: Designed for mobile (390 × 844px frame)
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Targets**: Minimum 44px

## 🔐 Security Features

- Password validation (min 6 characters)
- Email validation
- Phone number validation
- Supervisor PIN for void transactions
- Token-based authentication (base64 in development, use JWT in production)

## 💾 Database Models

### Users
- id, name, email, phone, password, role, avatar, address

### Products
- id, name, description, price, stock, barcode, image, categoryId, isActive

### Categories
- id, name, description, image

### Orders
- id, userId, orderNumber, status, subtotal, tax, discount, total, note, address, paymentMethod, paymentStatus

### Transactions (POS)
- id, shiftId, cashierId, transactionNumber, subtotal, tax, discount, total, paymentMethod, status

### Shifts
- id, cashierId, openingCash, closingCash, expectedCash, difference, status

### Members
- id, userId, points, tier, totalSpent

### Stock Logs
- id, productId, qty, type, reason

### Payments
- id, orderId, transactionId, amount, method, status, qrisImage, qrisInvoiceId

## 🚀 Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Run database migrations
bun run db:push

# Generate Prisma client
bun run db:generate

# Run linter
bun run lint
```

## 📝 Notes

- All APIs use Route Handlers (Next.js App Router)
- SQLite database is used for simplicity (migrate to PostgreSQL in production)
- Passwords are stored in plain text in development (use bcrypt in production)
- QRIS integration is mocked (integrate with Midtrans/Xendit in production)
- WhatsApp integration is mocked (integrate with Twilio/WA Business API in production)
- Token authentication uses base64 encoding in development (use JWT in production)

## 🎯 Future Enhancements

- Integrate real QRIS payment gateway
- Add real-time updates with WebSocket
- Implement JWT authentication
- Add email notifications
- Build admin dashboard
- Add receipt printing
- Implement multi-location support
- Add inventory management
- Create supplier management
- Add financial reports

## 📄 License

This project is for demonstration purposes.
