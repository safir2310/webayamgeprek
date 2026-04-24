'use client'

import { Button } from '@/components/ui/button'
import { ShieldX } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h1>

          <p className="text-gray-600 mb-6">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
            Silakan login dengan akun yang sesuai.
          </p>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Ke Beranda
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" className="w-full">
                Login Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
