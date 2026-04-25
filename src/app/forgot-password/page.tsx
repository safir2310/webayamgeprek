'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [phoneLast4, setPhoneLast4] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState<'verify' | 'reset' | 'success'>('verify')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVerify = async () => {
    if (!email || !phoneLast4) {
      toast({
        title: 'Data Tidak Lengkap',
        description: 'Mohon isi email dan 4 digit terakhir nomor HP',
        variant: 'destructive'
      })
      return
    }

    if (!email.includes('@')) {
      toast({
        title: 'Email Tidak Valid',
        description: 'Format email tidak benar',
        variant: 'destructive'
      })
      return
    }

    if (phoneLast4.length !== 4) {
      toast({
        title: 'Nomor HP Tidak Valid',
        description: 'Harap masukkan 4 digit terakhir nomor HP',
        variant: 'destructive'
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/auth/forgot-password-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneLast4 }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Verifikasi Gagal',
          description: data.error || 'Email atau nomor HP tidak ditemukan',
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Verifikasi Berhasil',
        description: 'Silakan masukkan password baru',
      })
      setStep('reset')
    } catch (error) {
      console.error('Verify error:', error)
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan koneksi',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Password Tidak Lengkap',
        description: 'Mohon isi password baru dan konfirmasi',
        variant: 'destructive'
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password Tidak Cocok',
        description: 'Password baru dan konfirmasi tidak sama',
        variant: 'destructive'
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Password Terlalu Pendek',
        description: 'Password minimal 6 karakter',
        variant: 'destructive'
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/auth/reset-password-with-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneLast4, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Reset Password Gagal',
          description: data.error || 'Terjadi kesalahan',
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Password Berhasil Diubah',
        description: 'Silakan login dengan password baru',
      })
      setStep('success')
    } catch (error) {
      console.error('Reset password error:', error)
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan koneksi',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <CardContent className="space-y-6 pt-6">
          {/* Back to Login */}
          <Link href="/">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Lupa Password</h1>
            <p className="text-muted-foreground">
              {step === 'verify' && 'Verifikasi identitas Anda untuk mereset password'}
              {step === 'reset' && 'Masukkan password baru Anda'}
              {step === 'success' && 'Password berhasil diubah!'}
            </p>
          </div>

          {/* Step 1: Verify */}
          {step === 'verify' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>4 Digit Terakhir Nomor HP</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="****"
                    value={phoneLast4}
                    onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="pl-10 text-center text-2xl tracking-widest"
                    maxLength={4}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan 4 digit terakhir dari nomor HP Anda
                </p>
              </div>

              <Button
                onClick={handleVerify}
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {isSubmitting ? 'Memverifikasi...' : 'Verifikasi'}
              </Button>
            </div>
          )}

          {/* Step 2: Reset Password */}
          {step === 'reset' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="•••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="•••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {isSubmitting ? 'Mengubah...' : 'Ganti Password'}
              </Button>

              <Button
                onClick={() => setStep('verify')}
                variant="outline"
                className="w-full"
              >
                Kembali
              </Button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Password Berhasil Diubah!</h3>
                  <p className="text-muted-foreground">
                    Anda sekarang dapat login dengan password baru Anda
                  </p>
                </div>
              </div>
              <Link href="/" className="block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Ke Halaman Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
