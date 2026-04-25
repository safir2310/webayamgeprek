'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ShieldCheck,
  Utensils,
  Users,
  ShoppingCart,
  ArrowRight,
  LogOut,
  CreditCard,
  QrCode,
  Wallet,
  WalletCards,
  Plus,
  Edit2,
  Trash2,
  Gift,
  Star,
  Package,
  Home,
  LayoutDashboard,
  Settings,
  UserCog,
  Receipt,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react'
import { logout, getToken } from '@/lib/auth'
import { toast } from '@/hooks/use-toast'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 156,
    totalRevenue: 4580000,
    totalUsers: 89,
    totalProducts: 24,
  })

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'members', label: 'Member', icon: UserCog },
    { id: 'reports', label: 'Laporan', icon: Receipt },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ]

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [editingPayment, setEditingPayment] = useState<any>(null)
  const [newPayment, setNewPayment] = useState({
    name: '',
    displayName: '',
    description: '',
    icon: ''
  })

  // Redeem products state
  const [redeemProducts, setRedeemProducts] = useState<any[]>([])
  const [showRedeemDialog, setShowRedeemDialog] = useState(false)
  const [editingRedeem, setEditingRedeem] = useState<any>(null)
  const [newRedeemProduct, setNewRedeemProduct] = useState({
    name: '',
    description: '',
    points: 0,
    image: '',
    stock: -1
  })

  useEffect(() => {
    // Check authentication
    const token = getToken()
    if (!token) {
      window.location.href = '/admin/login'
      return
    }

    // Fetch user info
    fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.user) {
          setUser(data.user)
        } else {
          window.location.href = '/admin/login'
        }
      })
      .catch(() => {
        window.location.href = '/admin/login'
      })
  }, [])

  // Fetch payment methods
  useEffect(() => {
    fetch('/api/payment-methods')
      .then((res) => res.json())
      .then((data) => {
        if (data.paymentMethods) {
          setPaymentMethods(data.paymentMethods)
        }
      })
      .catch(() => console.error('Failed to fetch payment methods'))
  }, [])

  // Fetch redeem products
  useEffect(() => {
    fetch('/api/redeem-products')
      .then((res) => res.json())
      .then((data) => {
        if (data.redeemProducts) {
          setRedeemProducts(data.redeemProducts)
        }
      })
      .catch(() => console.error('Failed to fetch redeem products'))
  }, [])

  // Payment method handlers
  const handleTogglePaymentMethod = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        setPaymentMethods(paymentMethods.map((pm) =>
          pm.id === id ? { ...pm, isActive: !currentStatus } : pm
        ))
        toast({
          title: 'Berhasil',
          description: `Metode pembayaran telah ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mengubah status metode pembayaran',
        variant: 'destructive'
      })
    }
  }

  const handleSavePaymentMethod = async () => {
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPayment,
          isActive: true,
          sortOrder: paymentMethods.length + 1
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentMethods([...paymentMethods, data.paymentMethod])
        setShowPaymentDialog(false)
        setNewPayment({ name: '', displayName: '', description: '', icon: '' })
        toast({
          title: 'Berhasil',
          description: 'Metode pembayaran baru telah ditambahkan',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menambahkan metode pembayaran',
        variant: 'destructive'
      })
    }
  }

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
        toast({
          title: 'Berhasil',
          description: 'Metode pembayaran telah dihapus',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus metode pembayaran',
        variant: 'destructive'
      })
    }
  }

  // Redeem product handlers
  const handleToggleRedeemProduct = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/redeem-products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        setRedeemProducts(redeemProducts.map((rp) =>
          rp.id === id ? { ...rp, isActive: !currentStatus } : rp
        ))
        toast({
          title: 'Berhasil',
          description: `Produk telah ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mengubah status produk',
        variant: 'destructive'
      })
    }
  }

  const handleSaveRedeemProduct = async () => {
    try {
      if (editingRedeem) {
        // Update existing product
        const response = await fetch(`/api/redeem-products/${editingRedeem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRedeemProduct)
        })

        if (response.ok) {
          setRedeemProducts(redeemProducts.map((rp) =>
            rp.id === editingRedeem.id ? { ...rp, ...newRedeemProduct } : rp
          ))
          setShowRedeemDialog(false)
          setEditingRedeem(null)
          setNewRedeemProduct({ name: '', description: '', points: 0, image: '', stock: -1 })
          toast({
            title: 'Berhasil',
            description: 'Produk telah diperbarui',
          })
        }
      } else {
        // Create new product
        const response = await fetch('/api/redeem-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newRedeemProduct,
            isActive: true,
            sortOrder: redeemProducts.length + 1
          })
        })

        if (response.ok) {
          const data = await response.json()
          setRedeemProducts([...redeemProducts, data.redeemProduct])
          setShowRedeemDialog(false)
          setNewRedeemProduct({ name: '', description: '', points: 0, image: '', stock: -1 })
          toast({
            title: 'Berhasil',
            description: 'Produk baru telah ditambahkan',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan produk',
        variant: 'destructive'
      })
    }
  }

  const handleEditRedeemProduct = (product: any) => {
    setEditingRedeem(product)
    setNewRedeemProduct({
      name: product.name,
      description: product.description,
      points: product.points,
      image: product.image,
      stock: product.stock
    })
    setShowRedeemDialog(true)
  }

  const handleDeleteRedeemProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/redeem-products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setRedeemProducts(redeemProducts.filter((rp) => rp.id !== id))
        toast({
          title: 'Berhasil',
          description: 'Produk telah dihapus',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus produk',
        variant: 'destructive'
      })
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${sidebarCollapsed ? 'w-20' : 'w-72'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          transition-all duration-300 ease-in-out
          bg-gradient-to-b from-gray-900 to-gray-800
          text-white
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <p className="text-xs text-gray-400">Sambal Ijo</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md mx-auto">
              <Utensils className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setMobileSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !sidebarCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer - User Info */}
        <div className="p-4 border-t border-gray-700">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 capitalize truncate">{user?.role || 'Administrator'}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 hover:bg-gray-700 w-full"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 capitalize">
                    {activeSection === 'dashboard' ? 'Dashboard' :
                     activeSection === 'products' ? 'Kelola Produk' :
                     activeSection === 'orders' ? 'Kelola Pesanan' :
                     activeSection === 'users' ? 'Kelola Pengguna' :
                     activeSection === 'members' ? 'Kelola Member' :
                     activeSection === 'reports' ? 'Laporan' :
                     activeSection === 'settings' ? 'Pengaturan' : 'Dashboard'}
                  </h1>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
                  <Badge variant="outline" className="text-xs">
                    {user?.role || 'Administrator'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Dashboard Content */}
          {activeSection === 'dashboard' && (
            <>
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Berikut ringkasan aktivitas restoran Anda
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pengguna</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Produk</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Kelola Pesanan</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200"
          >
            <Users className="w-6 h-6" />
            <span>Kelola Pengguna</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-200"
          >
            <Utensils className="w-6 h-6" />
            <span>Kelola Produk</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200"
          >
            <ShieldCheck className="w-6 h-6" />
            <span>Pengaturan</span>
          </Button>
        </div>
            </>
          )}

          {/* Settings Content */}
          {activeSection === 'settings' && (
            <>

        {/* Payment Methods Management */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Metode Pembayaran</h3>
                <p className="text-sm text-gray-500">Kelola metode pembayaran yang tersedia</p>
              </div>
              <Button
                onClick={() => {
                  setShowPaymentDialog(true)
                  setNewPayment({ name: '', displayName: '', description: '', icon: '' })
                }}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </Button>
            </div>
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {pm.icon ? (
                        <span className="text-2xl">{pm.icon}</span>
                      ) : pm.name === 'qris' ? (
                        <QrCode className="w-6 h-6 text-gray-600" />
                      ) : pm.name === 'transfer' ? (
                        <WalletCards className="w-6 h-6 text-gray-600" />
                      ) : (
                        <Wallet className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{pm.displayName}</p>
                      <p className="text-sm text-gray-500">{pm.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={pm.isActive ? 'default' : 'secondary'}>
                      {pm.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePaymentMethod(pm.id, pm.isActive)}
                      >
                        {pm.isActive ? '🔴' : '🟢'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePaymentMethod(pm.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Payment Method Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Metode Pembayaran</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Nama (unik)</Label>
                <Input
                  value={newPayment.name}
                  onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                  placeholder="Contoh: cash, qris, transfer"
                />
              </div>
              <div>
                <Label>Nama Tampilan</Label>
                <Input
                  value={newPayment.displayName}
                  onChange={(e) => setNewPayment({ ...newPayment, displayName: e.target.value })}
                  placeholder="Contoh: Cash, QRIS, Transfer Bank"
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  placeholder="Deskripsi singkat metode pembayaran"
                />
              </div>
              <div>
                <Label>Icon (emoji)</Label>
                <Input
                  value={newPayment.icon}
                  onChange={(e) => setNewPayment({ ...newPayment, icon: e.target.value })}
                  placeholder="💵 atau biarkan kosong"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Batal
              </Button>
              <Button onClick={handleSavePaymentMethod}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Redeem Products Management */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Produk Tukar Poin</h3>
                <p className="text-sm text-gray-500">Kelola produk yang dapat ditukar dengan poin</p>
              </div>
              <Button
                onClick={() => {
                  setShowRedeemDialog(true)
                  setEditingRedeem(null)
                  setNewRedeemProduct({ name: '', description: '', points: 0, image: '', stock: -1 })
                }}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {redeemProducts.map((rp) => (
                <Card key={rp.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{rp.image || <Gift className="w-8 h-8 text-orange-500" />}</span>
                          <Badge variant={rp.isActive ? 'default' : 'secondary'}>
                            {rp.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{rp.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{rp.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleRedeemProduct(rp.id, rp.isActive)}
                        >
                          {rp.isActive ? '🔴' : '🟢'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRedeemProduct(rp)}
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRedeemProduct(rp.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Poin</p>
                        <p className="text-lg font-bold text-orange-600">{rp.points}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {rp.stock === -1 ? 'Unlimited' : rp.stock}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Redeem Product Dialog */}
        <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRedeem ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Nama Produk</Label>
                <Input
                  value={newRedeemProduct.name}
                  onChange={(e) => setNewRedeemProduct({ ...newRedeemProduct, name: e.target.value })}
                  placeholder="Nama produk tukar poin"
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  value={newRedeemProduct.description}
                  onChange={(e) => setNewRedeemProduct({ ...newRedeemProduct, description: e.target.value })}
                  placeholder="Deskripsi produk"
                  rows={3}
                />
              </div>
              <div>
                <Label>Poin yang Dibutuhkan</Label>
                <Input
                  type="number"
                  value={newRedeemProduct.points}
                  onChange={(e) => setNewRedeemProduct({ ...newRedeemProduct, points: parseInt(e.target.value) || 0 })}
                  placeholder="Jumlah poin"
                  min={0}
                />
              </div>
              <div>
                <Label>Icon/Emoji (opsional)</Label>
                <Input
                  value={newRedeemProduct.image}
                  onChange={(e) => setNewRedeemProduct({ ...newRedeemProduct, image: e.target.value })}
                  placeholder="🎟️ atau biarkan kosong"
                />
              </div>
              <div>
                <Label>Stock (-1 untuk unlimited)</Label>
                <Input
                  type="number"
                  value={newRedeemProduct.stock}
                  onChange={(e) => setNewRedeemProduct({ ...newRedeemProduct, stock: parseInt(e.target.value) || -1 })}
                  placeholder="-1 untuk unlimited"
                  min={-1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowRedeemDialog(false)
                setEditingRedeem(null)
                setNewRedeemProduct({ name: '', description: '', points: 0, image: '', stock: -1 })
              }}>
                Batal
              </Button>
              <Button onClick={handleSaveRedeemProduct}>
                {editingRedeem ? 'Update' : 'Simpan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
            </>
          )}

          {/* Placeholder for other sections */}
          {activeSection !== 'dashboard' && activeSection !== 'settings' && (
            <Card className="mb-8">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {activeSection === 'products' ? 'Kelola Produk' :
                       activeSection === 'orders' ? 'Kelola Pesanan' :
                       activeSection === 'users' ? 'Kelola Pengguna' :
                       activeSection === 'members' ? 'Kelola Member' :
                       activeSection === 'reports' ? 'Laporan' : 'Halaman Ini'}
                    </h3>
                    <p className="text-gray-600">
                      Halaman ini sedang dalam pengembangan. Silakan kembali ke Dashboard atau Pengaturan.
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveSection('dashboard')}
                    className="gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Kembali ke Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
