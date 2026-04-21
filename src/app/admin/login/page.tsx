'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Utensils, Mail, Lock, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Login Gagal',
        description: 'Mohon isi semua field',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Login Gagal',
          description: data.error || 'Email atau password salah',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }

      // Store admin data in localStorage (in production, use httpOnly cookies)
      localStorage.setItem('adminUser', JSON.stringify(data.user))

      toast({
        title: 'Login Berhasil',
        description: `Selamat datang, ${data.user.name}!`,
      })

      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan koneksi',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-2xl">
        <CardContent className="space-y-6 pt-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🍗</div>
            <h1 className="text-3xl font-bold mb-2">Ayam Geprek</h1>
            <p className="text-muted-foreground">Admin & Kasir Panel</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              <span>Sistem Manajemen Restoran</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@ayamgeprek.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 h-12"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-lg text-left">
              <div>
                <span className="font-semibold">Admin:</span> admin@ayamgeprek.com / admin123
              </div>
              <div>
                <span className="font-semibold">Kasir:</span> kasir@ayamgeprek.com / kasir123
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/')}
          >
            <Utensils className="mr-2 h-5 w-5" />
            Kembali ke Aplikasi Pelanggan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
