# Sistem Otorisasi Login - Ayam Geprek Sambal Ijo

## Ringkasan

Sistem ini memiliki 3 jenis user dengan hak akses berbeda:
1. **User** - Pengguna biasa (pelanggan)
2. **Cashier** - Kasir (akses POS)
3. **Admin** - Administrator (akses penuh)

## Akun Demo

### Admin
- Email: `admin@ayamgeprek.com`
- Password: `admin123`
- Akses: Dashboard admin penuh

### Kasir
- Email: `kasir@ayamgeprek.com`
- Password: `kasir123`
- Akses: POS (Point of Sale)

### User Regular
- Bisa register sendiri melalui halaman utama
- Akses: Order menu, voucher, member card

## Fitur Otorisasi

### 1. Login API
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@ayamgeprek.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJ1c2VySWQiOiI...}",
  "role": "admin",
  "user": {
    "id": "clxxx",
    "name": "Super Admin",
    "email": "admin@ayamgeprek.com",
    "phone": "6280000000001",
    "avatar": null
  }
}
```

### 2. Register API
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "628123456789",
  "password": "password123",
  "role": "user"
}
```

### 3. Verify Token API
**Endpoint:** `GET /api/auth/verify`
**Header:** `Authorization: Bearer <token>`

### 4. User Management API (Admin Only)

**Get Users:** `GET /api/users?role=admin&limit=50&offset=0`
**Get User:** `GET /api/users/[id]`
**Update User:** `PATCH /api/users/[id]`
**Delete User:** `DELETE /api/users/[id]`
**Create User:** `POST /api/admin/users`

## Routing Berdasarkan Role

### Role: Admin
- Redirect ke `/admin/dashboard`
- Akses penuh ke semua fitur admin
- Bisa membuat/mengubah/menghapus user

### Role: Cashier
- Redirect ke `/` dengan screen `pos`
- Akses ke POS System
- Tidak bisa mengakses dashboard admin

### Role: User
- Redirect ke `/` dengan screen `home`
- Akses ke menu ordering, voucher, member card
- Tidak bisa mengakses admin atau POS

## Helper Functions (lib/auth.ts)

```typescript
import { login, logout, getToken, setToken, removeToken } from '@/lib/auth'

// Login
const result = await login(email, password)

// Logout
logout()

// Get token
const token = getToken()

// Set token
setToken(token)

// Remove token
removeToken()
```

## Database Schema

User memiliki field `role` dengan nilai:
- `user` (default)
- `cashier`
- `admin`

## Security Notes

⚠️ **PENTING:** Password saat ini tidak di-hash (untuk development)

Dalam production:
1. Gunakan bcrypt untuk password hashing
2. Gunakan JWT atau NextAuth.js untuk token
3. Implementasi rate limiting
4. Tambahkan refresh token mechanism
5. Implementasi CSRF protection

## Cara Membuat Admin/Kasir Baru

### Cara 1: Melalui Admin Dashboard
1. Login sebagai admin
2. Buka menu "Kelola Pengguna"
3. Klik "Tambah User"
4. Pilih role (admin/cashier)
5. Isi data user
6. Save

### Cara 2: Langsung di Database
```typescript
// Contoh menggunakan Prisma
await db.user.create({
  data: {
    name: "Nama Admin",
    email: "admin@ayamgeprek.com",
    phone: "6280000000000",
    password: "admin123", // Production: hash dengan bcrypt
    role: "admin"
  }
})
```

### Cara 3: Menggunakan API
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kasir Baru",
    "email": "kasirbaru@ayamgeprek.com",
    "phone": "6280000000000",
    "password": "kasir123",
    "role": "cashier"
  }'
```

## Halaman yang Tersedia

1. `/` - Halaman utama (user)
2. `/admin/login` - Login untuk admin dan kasir
3. `/admin/dashboard` - Dashboard admin
4. `/unauthorized` - Halaman akses ditolak

## Next Steps untuk Production

1. Implementasi password hashing dengan bcrypt
2. Gunakan JWT atau NextAuth.js untuk token management
3. Aktifkan middleware untuk server-side auth check
4. Implementasi refresh token
5. Tambahkan rate limiting untuk login attempts
6. Log semua aktivitas login/logout
7. Implementasi 2FA untuk admin
