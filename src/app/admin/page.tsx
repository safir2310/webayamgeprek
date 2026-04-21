'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  DollarSign,
  Bell,
  MessageCircle,
  LogOut,
  Utensils,
  Settings,
  TrendingUp,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Minus,
  Search,
  Filter
} from 'lucide-react'

type TabType = 'dashboard' | 'orders' | 'products' | 'stock' | 'customers' | 'notifications' | 'chat'

interface DashboardStats {
  totalSales: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  todaySales: number
  todayOrders: number
  pendingOrders: number
  processingOrders: number
  completedOrders: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Mock data
  const [mockOrders, setMockOrders] = useState([
    {
      id: '1',
      orderNumber: 'ORD001',
      customerName: 'Budi Santoso',
      total: 53000,
      status: 'completed',
      items: 3,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      orderNumber: 'ORD002',
      customerName: 'Siti Aminah',
      total: 76000,
      status: 'processing',
      items: 5,
      createdAt: new Date(Date.now() - 1800000)
    },
    {
      id: '3',
      orderNumber: 'ORD003',
      customerName: 'Joko Widodo',
      total: 42000,
      status: 'pending',
      items: 2,
      createdAt: new Date(Date.now() - 900000)
    }
  ])

  const [mockProducts, setMockProducts] = useState([
    { id: '1', name: 'Ayam Geprek Original', price: 25000, stock: 50, category: 'Main' },
    { id: '2', name: 'Ayam Geprek Keju', price: 30000, stock: 35, category: 'Main' },
    { id: '3', name: 'Ayam Geprek Telur', price: 28000, stock: 40, category: 'Main' },
    { id: '4', name: 'Nasi Geprek', price: 22000, stock: 45, category: 'Main' },
    { id: '5', name: 'Es Teh Manis', price: 8000, stock: 100, category: 'Drink' },
    { id: '6', name: 'Es Jeruk', price: 10000, stock: 80, category: 'Drink' }
  ])

  const [mockCustomers, setMockCustomers] = useState([
    { id: '1', name: 'Budi Santoso', email: 'budi@example.com', phone: '08123456789', totalOrders: 12, totalSpent: 650000 },
    { id: '2', name: 'Siti Aminah', email: 'siti@example.com', phone: '08129876543', totalOrders: 8, totalSpent: 420000 },
    { id: '3', name: 'Joko Widodo', email: 'joko@example.com', phone: '08125678901', totalOrders: 15, totalSpent: 780000 }
  ])

  const [notifications, setNotifications] = useState([
    { id: '1', type: 'order', title: 'Pesanan Baru', message: 'ORD003 dari Joko Widodo', time: '5 menit lalu', isRead: false },
    { id: '2', type: 'warning', title: 'Stok Menipis', message: 'Es Teh Manis sisa 10', time: '15 menit lalu', isRead: false },
    { id: '3', type: 'info', title: 'Pembayaran QRIS', message: 'Invoice #12345 berhasil', time: '30 menit lalu', isRead: true }
  ])

  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'customer', message: 'Apakah Ayam Geprek Original tersedia?', time: '10:30', isAdmin: false },
    { id: '2', sender: 'admin', message: 'Ya, masih ada stok 50 porsi', time: '10:32', isAdmin: true },
    { id: '3', sender: 'customer', message: 'Baik, saya pesan 2 ya', time: '10:33', isAdmin: false },
    { id: '4', sender: 'admin', message: 'Siap, pesanan sedang diproses', time: '10:34', isAdmin: true }
  ])

  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('adminUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    setUser(null)
    toast({
      title: 'Logout Berhasil',
      description: 'Anda telah keluar dari dashboard',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'processing':
        return 'Diproses'
      case 'pending':
        return 'Menunggu'
      case 'cancelled':
        return 'Dibatalkan'
      default:
        return status
    }
  }

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sendChatMessage = () => {
    if (!chatInput.trim()) return

    setChatMessages(prev => [...prev, {
      id: String(Date.now()),
      sender: 'admin',
      message: chatInput,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isAdmin: true
    }])
    setChatInput('')

    toast({
      title: 'Pesan Terkirim',
      description: 'Pesan Anda telah terkirim ke customer',
    })
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ))
  }

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex justify-center mb-4">
                <Utensils className="h-12 w-12 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">Admin Dashboard</div>
              <p className="text-sm text-gray-600 mt-2">Login untuk melanjutkan</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Email" type="email" />
              <Input placeholder="Password" type="password" />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Login
            </Button>
            <div className="text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Setup Admin Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Setup Admin Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Button
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/seed-data/admin', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'seed' })
                          })
                          const data = await response.json()

                          if (response.ok) {
                            toast({
                              title: 'Data Admin Berhasil Dibuat',
                              description: 'Silakan login dengan akun admin',
                            })
                            alert(`
Admin Login:
Email: admin@ayamgeprek.com
Password: admin123

Cashier Login:
Email: kasir@ayamgeprek.com
Password: kasir123
                            `)
                          } else {
                            toast({
                              title: 'Gagal',
                              description: data.error || 'Terjadi kesalahan',
                              variant: 'destructive'
                            })
                          }
                        } catch (error) {
                          toast({
                            title: 'Gagal',
                            description: 'Terjadi kesalahan koneksi',
                            variant: 'destructive'
                          })
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Buat Admin & Kasir Baru
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/seed-data/admin', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'reset' })
                          })
                          const data = await response.json()

                          if (response.ok) {
                            toast({
                              title: 'Data Admin Direset',
                              description: 'Silakan login ulang',
                            })
                          } else {
                            toast({
                              title: 'Gagal',
                              description: data.error || 'Terjadi kesalahan',
                              variant: 'destructive'
                            })
                          }
                        } catch (error) {
                          toast({
                            title: 'Gagal',
                            description: 'Terjadi kesalahan koneksi',
                            variant: 'destructive'
                          })
                        }
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Reset Admin Data
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Utensils className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-white/80">Ayam Geprek Sambal Ijo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs h-5 w-5 flex items-center justify-center p-0">
                      {unreadNotificationCount}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Notifikasi</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  <div className="space-y-3">
                    {notifications.map(notif => (
                      <Card
                        key={notif.id}
                        className={notif.isRead ? 'opacity-60' : ''}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 ${
                              notif.type === 'order' ? 'bg-green-100' :
                              notif.type === 'warning' ? 'bg-yellow-100' :
                              'bg-blue-100'
                            } rounded-full p-2`}>
                              {notif.type === 'order' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                               notif.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-600" /> :
                               <Bell className="h-5 w-5 text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-sm text-gray-600">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {notifications.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Tidak ada notifikasi</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
                <DialogHeader className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-4">
                  <DialogTitle className="text-white">Chat Customer Service</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex gap-3 ${msg.isAdmin ? '' : 'justify-end'}`}>
                        {msg.isAdmin ? (
                          <>
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">👨‍💼</span>
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-white/80 mt-1">{msg.time}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg">👤</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tulis pesan..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          sendChatMessage()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      onClick={sendChatMessage}
                      className="bg-orange-500 hover:bg-orange-600"
                      disabled={!chatInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen p-4">
          <div className="space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Home className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'orders' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="h-4 w-4 mr-3" />
              Pesanan
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'products' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package className="h-4 w-4 mr-3" />
              Produk
            </Button>
            <Button
              variant={activeTab === 'stock' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'stock' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              onClick={() => setActiveTab('stock')}
            >
              <Settings className="h-4 w-4 mr-3" />
              Stok
            </Button>
            <Button
              variant={activeTab === 'customers' ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === 'customers' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              <Users className="h-4 w-4 mr-3" />
              Pelanggan
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Penjualan</p>
                          <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats?.totalSales || 0)}</p>
                        </div>
                        <DollarSign className="h-10 w-10 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Pesanan</p>
                          <p className="text-2xl font-bold text-green-600">{stats?.totalOrders || 0}</p>
                        </div>
                        <ShoppingCart className="h-10 w-10 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Produk</p>
                          <p className="text-2xl font-bold text-blue-600">{stats?.totalProducts || 0}</p>
                        </div>
                        <Package className="h-10 w-10 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Pelanggan</p>
                          <p className="text-2xl font-bold text-purple-600">{stats?.totalCustomers || 0}</p>
                        </div>
                        <Users className="h-10 w-10 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistik Hari Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Penjualan Hari Ini</span>
                        <span className="text-xl font-bold text-green-600">{formatCurrency(stats?.todaySales || 0)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pesanan Hari Ini</span>
                        <span className="text-xl font-bold">{stats?.todayOrders || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span>Menunggu</span>
                        </div>
                        <span className="text-xl font-bold text-yellow-600">{stats?.pendingOrders || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span>Diproses</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">{stats?.processingOrders || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span>Selesai</span>
                        </div>
                        <span className="text-xl font-bold text-green-600">{stats?.completedOrders || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Pesanan Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockOrders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{order.orderNumber}</span>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                            <span className="text-gray-600">{order.customerName}</span>
                          </div>
                          <p className="text-sm text-gray-500">{order.items} item • {formatCurrency(order.total)}</p>
                        </div>
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Kelola Pesanan</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Cari pesanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setStatusFilter(statusFilter === 'all' ? 'pending' : 'all')}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === 'all' ? 'Semua' : 'Pending'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">{order.orderNumber}</span>
                        </div>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.items} item</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-orange-600">{formatCurrency(order.total)}</span>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Kelola Produk</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk
                </Button>
              </div>

              <div className="mb-4">
                <Input
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left p-4 font-semibold">Nama Produk</th>
                          <th className="text-left p-4 font-semibold">Kategori</th>
                          <th className="text-left p-4 font-semibold">Harga</th>
                          <th className="text-left p-4 font-semibold">Stok</th>
                          <th className="text-left p-4 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map(product => (
                          <tr key={product.id} className="border-b">
                            <td className="p-4">{product.name}</td>
                            <td className="p-4">
                              <Badge variant="outline">{product.category}</Badge>
                            </td>
                            <td className="p-4">{formatCurrency(product.price)}</td>
                            <td className="p-4">
                              <Badge
                                variant={product.stock < 20 ? 'destructive' : 'default'}
                              className={product.stock < 20 ? 'bg-red-100 text-red-700' : ''}
                              >
                                {product.stock}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="icon" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stock Tab */}
          {activeTab === 'stock' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Kelola Stok</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Restock
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <Package className="h-12 w-12 mx-auto text-orange-500" />
                      <p className="text-3xl font-bold text-orange-600">1,120</p>
                      <p className="text-sm text-gray-600">Total Stok Produk</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
                      <p className="text-3xl font-bold text-red-600">8</p>
                      <p className="text-sm text-gray-600">Produk Menipis</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Produk Menipis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProducts.filter(p => p.stock < 30).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">Kategori: {product.category}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="mb-2">
                            Stok: {product.stock}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Kelola Pelanggan</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCustomers.map(customer => (
                  <Card key={customer.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-lg">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <p className="text-sm text-gray-600">{customer.phone}</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Total Pesanan</p>
                            <p className="text-xl font-bold text-orange-600">{customer.totalOrders}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Belanja</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(customer.totalSpent)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
