'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  Bell,
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    revenue: 0,
    todayRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0
  })

  // Orders
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Products
  const [products, setProducts] = useState<any[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Main',
    image: ''
  })

  // Customers
  const [customers, setCustomers] = useState<any[]>([])

  // Chat
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')
  const [selectedUserChat, setSelectedUserChat] = useState<any>(null)
  const [allUserChats, setAllUserChats] = useState<any[]>([])

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([])
  const [isAddNotifOpen, setIsAddNotifOpen] = useState(false)
  const [notifForm, setNotifForm] = useState({
    title: '',
    message: '',
    type: 'info'
  })

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      if (response.ok) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      if (response.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      if (response.ok) {
        setCustomers(data.customers)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  const fetchAllUserChats = async () => {
    try {
      const response = await fetch('/api/admin/chats')
      const data = await response.json()
      if (response.ok) {
        setAllUserChats(data.chats || [])

        // Load first user's chat if available
        if (data.chats && data.chats.length > 0) {
          loadUserChat(data.chats[0].userId)
        }
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    }
  }

  const loadUserChat = async (userId: string) => {
    setSelectedUserChat(userId)
    try {
      const response = await fetch(`/api/admin/chats?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setChatMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to load user chat:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      const data = await response.json()
      if (response.ok) {
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('adminUser')
    if (!storedAdmin) {
      router.push('/admin/login')
      return
    }

    // Set admin user
    const admin = JSON.parse(storedAdmin)
    setAdminUser(admin)

    // Load initial data
    fetchDashboardData()
    fetchOrders()
    fetchProducts()
    fetchCustomers()
    fetchAllUserChats()
    fetchNotifications()
  }, [router])

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !selectedUserChat) return

    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserChat,
          senderRole: 'admin',
          message: chatInput.trim()
        })
      })

      const data = await response.json()
      if (response.ok) {
        setChatMessages(prev => [...prev, data.chatMessage])
        setChatInput('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/order/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      })

      if (response.ok) {
        fetchOrders()
        fetchDashboardData()
        toast({
          title: 'Berhasil',
          description: 'Status pesanan diperbarui',
        })
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      })

      if (response.ok) {
        fetchProducts()
        fetchDashboardData()
        setIsAddProductOpen(false)
        setProductForm({ name: '', description: '', price: '', stock: '', category: 'Main', image: '' })
        toast({
          title: 'Berhasil',
          description: 'Produk ditambahkan',
        })
      }
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  const handleUpdateProduct = async () => {
    if (!editProduct) return

    try {
      const response = await fetch(`/api/admin/products/${editProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      })

      if (response.ok) {
        fetchProducts()
        setEditProduct(null)
        setProductForm({ name: '', description: '', price: '', stock: '', category: 'Main', image: '' })
        toast({
          title: 'Berhasil',
          description: 'Produk diperbarui',
        })
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchProducts()
        fetchDashboardData()
        toast({
          title: 'Berhasil',
          description: 'Produk dihapus',
        })
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const handleSendNotification = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifForm)
      })

      if (response.ok) {
        fetchNotifications()
        setIsAddNotifOpen(false)
        setNotifForm({ title: '', message: '', type: 'info' })
        toast({
          title: 'Berhasil',
          description: 'Notifikasi dikirim ke semua user',
        })
      }
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'processing': return 'bg-blue-500'
      case 'paid': return 'bg-purple-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai'
      case 'processing': return 'Diproses'
      case 'paid': return 'Dibayar'
      case 'pending': return 'Menunggu'
      case 'cancelled': return 'Dibatalkan'
      default: return status
    }
  }

  if (!adminUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 pt-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/80 text-sm">Ayam Geprek Sambal Ijo</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {adminUser.role === 'admin' ? 'Admin' : 'Kasir'}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs py-3">
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs py-3">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Pesanan
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs py-3">
              <Package className="w-4 h-4 mr-1" />
              Produk
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs py-3">
              <Users className="w-4 h-4 mr-1" />
              Pelanggan
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs py-3">
              <MessageSquare className="w-4 h-4 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs py-3">
              <Bell className="w-4 h-4 mr-1" />
              Notifikasi
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-orange-500 to-orange-400 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs">Total Pesanan</p>
                      <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-400 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs">Total Pendapatan</p>
                      <p className="text-2xl font-bold mt-1">Rp {stats.revenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500 to-blue-400 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs">Pesanan Hari Ini</p>
                      <p className="text-2xl font-bold mt-1">{stats.todayOrders}</p>
                    </div>
                    <Clock className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-400 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs">Pendapatan Hari Ini</p>
                      <p className="text-2xl font-bold mt-1">Rp {stats.todayRevenue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-pink-500 to-pink-400 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs">Total Produk</p>
                      <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-400 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs">Total Pelanggan</p>
                      <p className="text-2xl font-bold mt-1">{stats.totalCustomers}</p>
                    </div>
                    <Users className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Pesanan Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-96">
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {getStatusText(order.status)}
                          </Badge>
                          <p className="text-sm font-medium mt-1">Rp {order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-4">Belum ada pesanan</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pesanan..."
                  className="pl-10"
                />
              </div>
              <Button onClick={fetchOrders} variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.name || 'Guest'}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.phone || ''}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-3">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.product?.name} x{item.qty}</span>
                            <span>Rp {(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Total: Rp {order.total.toLocaleString()}</p>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Menunggu</SelectItem>
                            <SelectItem value="paid">Dibayar</SelectItem>
                            <SelectItem value="processing">Diproses</SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                            <SelectItem value="cancelled">Dibatalkan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Belum ada pesanan</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk..."
                  className="pl-10"
                />
              </div>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nama Produk</Label>
                      <Input
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Ayam Geprek Original"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Deskripsi</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Ayam goreng crispy dengan sambal ijo pedas"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Harga</Label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          placeholder="25000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stok</Label>
                        <Input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          placeholder="50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Kategori</Label>
                      <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main">Main Course</SelectItem>
                          <SelectItem value="Drink">Minuman</SelectItem>
                          <SelectItem value="Snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddProduct} className="w-full bg-orange-500 hover:bg-orange-600">
                      Simpan
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-4xl">{product.image || '🍗'}</div>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-orange-600">Rp {product.price.toLocaleString()}</p>
                        <Badge variant="outline">Stok: {product.stock}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setEditProduct(product)
                            setProductForm({
                              name: product.name,
                              description: product.description || '',
                              price: product.price.toString(),
                              stock: product.stock.toString(),
                              category: 'Main',
                              image: product.image || ''
                            })
                            setIsAddProductOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {products.length === 0 && (
                  <p className="col-span-2 text-center text-muted-foreground py-8">Belum ada produk</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari pelanggan..." className="pl-10" />
            </div>

            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-3">
                {customers.map((customer) => (
                  <Card key={customer.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-lg">👤</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{customer.role}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-muted-foreground">No. HP</p>
                          <p className="font-medium">{customer.phone}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-muted-foreground">Poin</p>
                          <p className="font-medium">{customer.member?.points || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {customers.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Belum ada pelanggan</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4 h-[calc(100vh-280px)]">
              {/* User List */}
              <Card>
                <CardContent className="p-3">
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      {allUserChats.map((chat) => (
                        <button
                          key={chat.userId}
                          onClick={() => loadUserChat(chat.userId)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedUserChat === chat.userId
                              ? 'bg-orange-500 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <p className="font-medium text-sm truncate">{chat.user?.name || 'User'}</p>
                          <p className="text-xs opacity-80">{chat.user?.phone || ''}</p>
                          {chat.unreadCount > 0 && (
                            <Badge className={`mt-1 ${selectedUserChat === chat.userId ? 'bg-white text-orange-500' : ''}`}>
                              {chat.unreadCount} pesan baru
                            </Badge>
                          )}
                        </button>
                      ))}
                      {allUserChats.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-4">Belum ada percakapan</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card className="col-span-2">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="p-3 border-b bg-gray-50">
                    <p className="font-semibold">
                      {allUserChats.find(c => c.userId === selectedUserChat)?.user?.name || 'Pilih User'}
                    </p>
                  </div>
                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-3">
                      {chatMessages.map((msg) => {
                        const isAdmin = msg.senderRole === 'admin'
                        return (
                          <div key={msg.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl ${
                              isAdmin
                                ? 'bg-gray-200 rounded-tl-none'
                                : 'bg-orange-500 text-white rounded-tr-none'
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${isAdmin ? 'text-muted-foreground' : 'text-white/80'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      {chatMessages.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-8">Belum ada pesan</p>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tulis pesan..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                      />
                      <Button
                        size="icon"
                        onClick={sendChatMessage}
                        className="bg-orange-500 hover:bg-orange-600"
                        disabled={!chatInput.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Buat Notifikasi Baru</h3>
              <Dialog open={isAddNotifOpen} onOpenChange={setIsAddNotifOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Notifikasi
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Buat Notifikasi Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Judul</Label>
                      <Input
                        value={notifForm.title}
                        onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                        placeholder="Promo Spesial!"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pesan</Label>
                      <Textarea
                        value={notifForm.message}
                        onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                        placeholder="Diskon 20% untuk semua menu hari ini!"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipe</Label>
                      <Select value={notifForm.type} onValueChange={(value) => setNotifForm({ ...notifForm, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="promo">Promo</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSendNotification} className="w-full bg-orange-500 hover:bg-orange-600">
                      Kirim ke Semua User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Riwayat Notifikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[calc(100vh-400px)]">
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <Card key={notif.id} className="bg-gray-50">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">{notif.message}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {notif.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notif.createdAt).toLocaleString('id-ID')}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-4">Belum ada notifikasi</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
