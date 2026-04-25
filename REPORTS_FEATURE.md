# Fitur Laporan Penjualan - Ayam Geprek Sambal Ijo

## Overview
Sistem laporan penjualan yang terintegrasi dan tersinkronisasi antara sistem Admin, User (pelanggan), dan POS (Point of Sale).

## Fitur Utama

### 1. Jenis Laporan
- **Laporan Harian**: Rekapitulasi penjualan per hari
- **Laporan Mingguan**: Rekapitulasi penjualan per minggu (Senin - Minggu)
- **Laporan Bulanan**: Rekapitulasi penjualan per bulan

### 2. Metrik yang Dilacak
- Total Penjualan (dari Orders & Transactions)
- Total Pesanan (User Orders)
- Total Transaksi (POS)
- Total Item Terjual
- Rata-rata Nilai Pesanan
- Penjualan per Metode Pembayaran (Cash, QRIS, Transfer)
- Status Pesanan (Selesai, Dibatalkan)
- Produk Terlaris (Top 10)
- Penjualan per Kategori

### 3. Sinkronisasi Data
Laporan menggabungkan data dari dua sumber:
- **Orders**: Pesanan dari aplikasi user/online
- **Transactions**: Transaksi dari sistem POS kasir

## Database Schema

### Model: SalesReport
```prisma
model SalesReport {
  id                String   @id @default(cuid())
  type              String   // daily, weekly, monthly
  reportDate        DateTime // tanggal laporan
  totalSales        Float    @default(0)
  totalOrders       Int      @default(0)
  totalTransactions Int      @default(0)
  totalItems        Int      @default(0)
  averageOrderValue Float    @default(0)
  cashSales         Float    @default(0)
  qrisSales         Float    @default(0)
  transferSales     Float    @default(0)
  completedOrders   Int      @default(0)
  cancelledOrders   Int      @default(0)
  topSellingItems   String?  // JSON: produk terlaris
  paymentBreakdown  String?  // JSON: breakdown pembayaran
  categoryBreakdown String?  // JSON: breakdown kategori
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([type, reportDate])
}
```

## API Endpoints

### Admin Routes

#### GET `/api/admin/reports`
Mengambil daftar laporan.
- Query Parameters:
  - `type` (optional): Filter tipe laporan (daily, weekly, monthly)
  - `limit` (optional): Jumlah maksimal laporan (default: 30)
- Response:
  ```json
  {
    "reports": [
      {
        "id": "...",
        "type": "daily",
        "reportDate": "2024-01-15T00:00:00.000Z",
        "totalSales": 1500000,
        "totalOrders": 50,
        "totalTransactions": 30,
        "totalItems": 150,
        "averageOrderValue": 18750,
        "cashSales": 800000,
        "qrisSales": 500000,
        "transferSales": 200000,
        "completedOrders": 45,
        "cancelledOrders": 5,
        "topSellingItems": "[...]",
        "paymentBreakdown": "[...]",
        "categoryBreakdown": "[...]"
      }
    ]
  }
  ```

#### POST `/api/admin/reports/generate`
Generate laporan baru atau update laporan yang sudah ada.
- Request Body:
  ```json
  {
    "type": "daily",
    "date": "2024-01-15"
  }
  ```
- Response:
  ```json
  {
    "report": {
      "id": "...",
      // ... report data
    }
  }
  ```

### Public Routes (User & POS)

#### GET `/api/reports`
Mengambil daftar laporan untuk user dan POS.
- Query Parameters:
  - `type` (optional): Filter tipe laporan
  - `limit` (optional): Jumlah maksimal (default: 10)
- Response:
  ```json
  {
    "reports": [
      {
        "id": "...",
        "type": "daily",
        "reportDate": "...",
        "totalSales": 1500000,
        "totalOrders": 50,
        "totalTransactions": 30,
        "totalItems": 150,
        "averageOrderValue": 18750,
        "cashSales": 800000,
        "qrisSales": 500000,
        "transferSales": 200000,
        "completedOrders": 45,
        "cancelledOrders": 5,
        "topSellingItems": [
          {
            "name": "Ayam Geprek Original",
            "qty": 30,
            "revenue": 750000
          }
        ],
        "paymentBreakdown": [
          {
            "method": "Cash",
            "amount": 800000,
            "percentage": 53.33
          },
          {
            "method": "QRIS",
            "amount": 500000,
            "percentage": 33.33
          },
          {
            "method": "Transfer",
            "amount": 200000,
            "percentage": 13.33
          }
        ],
        "categoryBreakdown": [
          {
            "name": "Main",
            "revenue": 1200000,
            "count": 120
          },
          {
            "name": "Drink",
            "revenue": 300000,
            "count": 30
          }
        ]
      }
    ]
  }
  ```

#### GET `/api/reports/[id]`
Mengambil detail laporan spesifik.
- Response:
  ```json
  {
    "report": {
      "id": "...",
      // ... detailed report data with parsed JSON fields
    }
  }
  ```

## Cara Menggunakan

### Di Admin Panel

1. **Buka Tab Laporan**:
   - Login sebagai admin
   - Buka menu Admin
   - Klik tab "Laporan"

2. **Generate Laporan Baru**:
   - Klik tombol "Buat Laporan"
   - Pilih tipe laporan (Harian/Mingguan/Bulanan)
   - Pilih tanggal laporan
   - Klik "Generate"

3. **View Detail Laporan**:
   - Klik pada kartu laporan
   - Lihat detail lengkap:
     - Overview penjualan
     - Breakdown metode pembayaran
     - Status pesanan
     - Produk terlaris
     - Penjualan per kategori

4. **Filter Laporan**:
   - Gunakan dropdown filter untuk melihat:
     - Semua tipe laporan
     - Hanya laporan harian
     - Hanya laporan mingguan
     - Hanya laporan bulanan

### Di User/POS (Frontend)

User dan POS dapat mengakses laporan melalui API publik:

```typescript
// Mengambil laporan terbaru
const response = await fetch('/api/reports?type=daily&limit=10')
const data = await response.json()
const reports = data.reports

// Mengambil detail laporan
const detailResponse = await fetch(`/api/reports/${reportId}`)
const detailData = await detailResponse.json()
const reportDetail = detailData.report
```

## Alur Generate Laporan

1. **Admin memilih tipe dan tanggal laporan**
2. **Sistem menghitung rentang tanggal**:
   - Harian: 00:00 - 23:59 pada tanggal yang dipilih
   - Mingguan: Senin 00:00 - Minggu 23:59 pada minggu yang dipilih
   - Bulanan: Tanggal 1 - Akhir bulan

3. **Sistem mengambil data dari database**:
   - Orders dalam rentang tanggal
   - Transactions dalam rentang tanggal

4. **Sistem menghitung metrik**:
   - Total penjualan (sum dari total orders & transactions)
   - Total orders & transactions
   - Total item terjual
   - Rata-rata nilai pesanan
   - Breakdown per metode pembayaran
   - Status pesanan
   - Produk terlaris (sorted by qty)
   - Breakdown per kategori

5. **Sistem menyimpan laporan**:
   - Jika laporan sudah ada: Update laporan yang sudah ada
   - Jika laporan belum ada: Create laporan baru

6. **Laporan tersedia untuk semua sistem**:
   - Admin: Di Admin Panel
   - User: Melalui API publik
   - POS: Melalui API publik

## Fitur Tambahan

### Auto-regenerate
Laporan yang sudah ada akan otomatis di-regenerate jika admin membuat laporan baru untuk periode yang sama. Ini memastikan data laporan selalu up-to-date.

### Top Selling Items
Laporan menampilkan 10 produk terlaris berdasarkan jumlah kuantitas terjual.

### Payment Breakdown
Breakdown persentase per metode pembayaran untuk analisis tren pembayaran.

### Category Breakdown
Analisis penjualan per kategori produk untuk memahami preferensi pelanggan.

## Contoh Use Case

### Use Case 1: Analisis Harian
Manager ingin melihat performa penjualan hari ini:
1. Generate laporan harian untuk tanggal hari ini
2. Lihat total penjualan dan pesanan
3. Analisis metode pembayaran yang paling populer
4. Identifikasi produk terlaris
5. Bandingkan performa kategori produk

### Use Case 2: Review Mingguan
Pemilik ingin melakukan review mingguan:
1. Generate laporan mingguan untuk minggu yang sedang berjalan
2. Lihat tren penjualan dari Senin ke Minggu
3. Identifikasi hari dengan performa terbaik
4. Evaluasi metode pembayaran
5. Putuskan strategi promosi untuk minggu depan

### Use Case 3: Laporan Bulanan
Akuntan ingin mempersiapkan laporan bulanan:
1. Generate laporan bulanan untuk bulan yang diminta
2. Ekspor data total penjualan dan breakdown
3. Analisis kinerja kategori produk
4. Bandingkan dengan bulan-bulan sebelumnya
5. Buat keputusan stok dan pembelian

## File Terkait

### Backend
- `prisma/schema.prisma` - Database schema
- `src/app/api/admin/reports/route.ts` - Admin reports API
- `src/app/api/admin/reports/generate/route.ts` - Report generation
- `src/app/api/reports/route.ts` - Public reports API
- `src/app/api/reports/[id]/route.ts` - Report detail API

### Frontend
- `src/app/admin/page.tsx` - Admin panel with reports tab

## Status Implementasi

✅ Database schema (SalesReport)
✅ Admin API routes (GET, POST generate)
✅ Public API routes (GET, GET detail)
✅ Admin UI (list, generate, detail)
✅ Data sync from Orders & Transactions
✅ Report metrics calculation
✅ Top selling items tracking
✅ Payment breakdown
✅ Category breakdown
✅ Filter by report type
✅ Report detail view

## Catatan Penting

1. **Timestamps**: Semua timestamp menggunakan UTC. Pastikan frontend mengonversi ke zona waktu lokal saat menampilkan.

2. **JSON Fields**: Fields seperti `topSellingItems`, `paymentBreakdown`, dan `categoryBreakdown` disimpan sebagai JSON string di database dan di-parse saat diambil dari API.

3. **Unique Constraint**: Setiap tipe laporan untuk tanggal unik di-create/update. Ada constraint `@@unique([type, reportDate])` untuk mencegah duplikasi.

4. **Auto-update**: Jika laporan sudah ada untuk tipe dan tanggal yang sama, sistem akan mengupdate data laporan yang sudah ada bukan membuat baru.

5. **Filtering**: API publik default limit 10 laporan terbaru. Admin API default limit 30.

## Future Enhancements

Potensi pengembangan di masa depan:

1. **Export to PDF/Excel**: Fitur export laporan ke format PDF atau Excel
2. **Email Reports**: Kirim laporan otomatis via email ke manager/pemilik
3. **Real-time Dashboard**: Dashboard real-time dengan grafik penjualan
4. **Comparison Reports**: Laporan perbandingan antar periode
5. **Forecasting**: Prediksi penjualan berdasarkan data historis
6. **Inventory Impact**: Analisis dampak penjualan terhadap stok
7. **Customer Analytics**: Analisis perilaku pelanggan berdasarkan data laporan
8. **Staff Performance**: Laporan performa kasir/staff per periode
