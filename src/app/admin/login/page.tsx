'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Utensils, ArrowRight } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { login } from '@/lib/auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: 'Login Gagal',
        description: 'Mohon isi semua field',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        // Check user role and redirect accordingly
        if (result.user?.role === 'admin') {
          window.location.href = '/admin/dashboard'
        } else if (result.user?.role === 'cashier') {
          window.location.href = '/?screen=pos'
        } else {
          toast({
            title: 'Akses Ditolak',
            description: 'Halaman ini khusus untuk admin dan kasir',
            variant: 'destructive',
          })
        }
      } else {
        toast({
          title: 'Login Gagal',
          description: result.error || 'Email atau password salah',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan koneksi',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg mb-4">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ayam Geprek Sambal Ijo
          </h1>
          <p className="text-gray-600">Portal Admin & Kasir</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Login</h2>
                <p className="text-sm text-gray-600">Masuk untuk mengelola sistem</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ayamgeprek.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Masuk
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500 font-medium mb-3 text-center uppercase tracking-wider">
                Akun Demo
              </p>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Admin</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border">
                      admin@ayamgeprek.com / admin123
                    </code>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Kasir</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border">
                      kasir@ayamgeprek.com / kasir123
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => (window.location.href = '/')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
