'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  RefreshCw,
  Printer,
  UserPlus,
  Tag,
  BarChart3,
  UserCog,
  X,
  Menu as MenuIcon,
  FileText,
  Calendar
} from 'lucide-react'

type ActiveTab = 'overview' | 'orders' | 'products' | 'categories' | 'customers' | 'cashiers' | 'chat' | 'notifications' | 'reports'

export default function AdminDashboard() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    revenue: 0,
    todayRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    totalCashiers: 0
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
    categoryId: '',
    image: ''
  })

  // Categories
  const [categories, setCategories] = useState<any[]>([])
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })

  // Customers
  const [customers, setCustomers] = useState<any[]>([])

  // Cashiers
  const [cashiers, setCashiers] = useState<any[]>([])
  const [isAddCashierOpen, setIsAddCashierOpen] = useState(false)
  const [cashierForm, setCashierForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  // Reports
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [salesReports, setSalesReports] = useState<any[]>([])

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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      if (response.ok) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
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

  const fetchCashiers = async () => {
    try {
      const response = await fetch('/api/admin/cashiers')
      const data = await response.json()
      if (response.ok) {
        setCashiers(data.cashiers)
      }
    } catch (error) {
      console.error('Failed to fetch cashiers:', error)
    }
  }

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/admin/reports?period=${reportPeriod}`)
      const data = await response.json()
      if (response.ok) {
        setSalesReports(data.reports)
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    }
  }

  const fetchAllUserChats = async () => {
    try {
      const response = await fetch('/api/admin/chats')
      const data = await response.json()
      if (response.ok) {
        setAllUserChats(data.chats || [])

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
    const storedAdmin = localStorage.getItem('adminUser')
    if (!storedAdmin) {
      router.push('/admin/login')
      return
    }

    const admin = JSON.parse(storedAdmin)

    // Check if mobile
    const mobile = window.innerWidth < 1024
    const sidebarInitialState = window.innerWidth >= 1024

    // Set all state at once using a function to avoid multiple renders
    requestAnimationFrame(() => {
      setAdminUser(admin)
      setIsMobile(mobile)
      setSidebarOpen(sidebarInitialState)

      // Load initial data after state is set
      setTimeout(() => {
        fetchDashboardData()
        fetchOrders()
        fetchProducts()
        fetchCategories()
        fetchCustomers()
        fetchCashiers()
        fetchReports()
        fetchAllUserChats()
        fetchNotifications()
      }, 0)
    })

    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
        setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '', image: '' })
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
        setProductForm({ name: '', description: '', price: '', stock: '', categoryId: '', image: '' })
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

  const handleAddCategory = async () => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      })

      if (response.ok) {
        fetchCategories()
        setIsAddCategoryOpen(false)
        setCategoryForm({ name: '', description: '' })
        toast({
          title: 'Berhasil',
          description: 'Kategori ditambahkan',
        })
      }
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCategories()
        fetchProducts()
        toast({
          title: 'Berhasil',
          description: 'Kategori dihapus',
        })
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const handleAddCashier = async () => {
    try {
      const response = await fetch('/api/admin/cashiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cashierForm)
      })

      if (response.ok) {
        fetchCashiers()
        setIsAddCashierOpen(false)
        setCashierForm({ name: '', email: '', phone: '', password: '' })
        toast({
          title: 'Berhasil',
          description: 'Kasir berhasil ditambahkan',
        })
      }
    } catch (error) {
      console.error('Failed to add cashier:', error)
    }
  }

  const handleDeleteCashier = async (cashierId: string) => {
    if (!confirm('Yakin ingin menghapus kasir ini?')) return

    try {
      const response = await fetch(`/api/admin/cashiers/${cashierId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCashiers()
        toast({
          title: 'Berhasil',
          description: 'Kasir dihapus',
        })
      }
    } catch (error) {
      console.error('Failed to delete cashier:', error)
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

  const handlePrintReport = () => {
    window.print()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProductForm({ ...productForm, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
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

  const navItems = [
    { id: 'overview' as const, label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'orders' as const, label: 'Pesanan', icon: ShoppingCart },
    { id: 'products' as const, label: 'Produk', icon: Package },
    { id: 'categories' as const, label: 'Kategori', icon: Tag },
    { id: 'reports' as const, label: 'Laporan', icon: BarChart3 },
    { id: 'customers' as const, label: 'Pelanggan', icon: Users },
    { id: 'cashiers' as const, label: 'Kasir', icon: UserCog },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'notifications' as const, label: 'Notifikasi', icon: Bell },
  ]

  if (!adminUser) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-orange-600 to-orange-500 text-white flex flex-col transition-all duration-300 fixed lg:relative z-50 h-full`}>
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-orange-400">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'lg:hidden'}`}>
              <span className="text-2xl">🍗</span>
              {sidebarOpen && <span className="font-bold text-lg">Admin Panel</span>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/20"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-white text-orange-600 font-semibold'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
          </nav>
        </ScrollArea>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-orange-400">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">👨‍💼</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{adminUser.name}</p>
                <p className="text-xs text-white/80 truncate">{adminUser.role === 'admin' ? 'Administrator' : 'Kasir'}</p>
              </div>
            )}
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {sidebarOpen && 'Keluar'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ${isMobile ? 'ml-0' : ''}`}>
        {/* Mobile Header */}
        <header className="bg-white border-b px-4 py-3 sticky top-0 z-40 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="w-6 h-6" />
          </Button>
        </header>

        <div className="p-3">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Ringkasan Dashboard</h1>
                  <p className="text-gray-500">Selamat datang kembali, {adminUser.name}!</p>
                </div>
                <Button onClick={fetchDashboardData} variant="outline" size="icon">
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-orange-500 to-orange-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Pesanan</p>
                        <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                      </div>
                      <ShoppingCart className="w-12 h-12 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Pendapatan</p>
                        <p className="text-2xl font-bold mt-2">Rp {stats.revenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Pesanan Hari Ini</p>
                        <p className="text-3xl font-bold mt-2">{stats.todayOrders}</p>
                      </div>
                      <Clock className="w-12 h-12 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Pendapatan Hari Ini</p>
                        <p className="text-2xl font-bold mt-2">Rp {stats.todayRevenue.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-pink-500 to-pink-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Produk</p>
                        <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                      </div>
                      <Package className="w-12 h-12 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Pelanggan</p>
                        <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
                      </div>
                      <Users className="w-12 h-12 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-teal-500 to-teal-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Kasir</p>
                        <p className="text-3xl font-bold mt-2">{stats.totalCashiers}</p>
                      </div>
                      <UserCog className="w-12 h-12 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-500 to-red-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Pesanan Pending</p>
                        <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
                      </div>
                      <Clock className="w-12 h-12 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Pesanan Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-96">
                    <div className="space-y-3">
                      {orders.slice(0, 10).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{order.orderNumber}</p>
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
                        <p className="text-center text-muted-foreground py-8">Belum ada pesanan</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Pesanan</h1>
                <Button onClick={fetchOrders} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari pesanan..." className="pl-10" />
                </div>
              </div>

              <ScrollArea className="max-h-[calc(100vh-250px)]">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-lg">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.user?.name || 'Guest'}</p>
                            <p className="text-xs text-muted-foreground">{order.user?.phone || ''}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-4">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-3 rounded">
                              <span>{item.product?.name} x{item.qty}</span>
                              <span className="font-medium">Rp {(item.price * item.qty).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-lg">Total: Rp {order.total.toLocaleString()}</p>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[160px]">
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
                    <p className="text-center text-muted-foreground py-12">Belum ada pesanan</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Produk
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                          rows={3}
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
                        <Select value={productForm.categoryId} onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Upload Gambar</Label>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="cursor-pointer"
                          />
                          {productForm.image && (
                            <div className="relative">
                              <img
                                src={productForm.image}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => setProductForm({ ...productForm, image: '' })}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button onClick={handleAddProduct} className="w-full bg-orange-500 hover:bg-orange-600">
                        {editProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari produk..." className="pl-10" />
                </div>
                <Select
                  value={productForm.categoryId || "all"}
                  onValueChange={(value) => setProductForm({ ...productForm, categoryId: value === "all" ? "" : value })}
                  className="w-[200px]"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-5xl">{product.image || '🍗'}</div>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-base mb-1 truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2 h-10">{product.description}</p>
                      <p className="text-xs text-muted-foreground mb-2">Kategori: {product.category?.name || '-'}</p>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-orange-600 text-lg">Rp {product.price.toLocaleString()}</p>
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
                              categoryId: product.categoryId || '',
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
                  <p className="col-span-full text-center text-muted-foreground py-12">Belum ada produk</p>
                )}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Kategori
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Kategori Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nama Kategori</Label>
                        <Input
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          placeholder="Main Course"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Deskripsi</Label>
                        <Textarea
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Deskripsi kategori"
                          rows={3}
                        />
                      </div>
                      <Button onClick={handleAddCategory} className="w-full bg-orange-500 hover:bg-orange-600">
                        Simpan Kategori
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Tag className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{category.name}</h3>
                            <p className="text-xs text-muted-foreground">{category.description || 'Tidak ada deskripsi'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{category._count?.products || 0} produk</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {categories.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-12">Belum ada kategori</p>
                )}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
                <div className="flex gap-2">
                  <Select value={reportPeriod} onValueChange={(v) => { setReportPeriod(v as any); fetchReports(); }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handlePrintReport} variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Laporan
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-green-500 to-green-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-10 h-10" />
                      <div>
                        <p className="text-white/80 text-sm">Total Penjualan</p>
                        <p className="text-2xl font-bold">Rp {salesReports.reduce((sum: any, r: any) => sum + r.total, 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <ShoppingCart className="w-10 h-10" />
                      <div>
                        <p className="text-white/80 text-sm">Total Transaksi</p>
                        <p className="text-2xl font-bold">{salesReports.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-400 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <TrendingUp className="w-10 h-10" />
                      <div>
                        <p className="text-white/80 text-sm">Rata-rata Penjualan</p>
                        <p className="text-2xl font-bold">Rp {(salesReports.reduce((sum: any, r: any) => sum + r.total, 0) / (salesReports.length || 1)).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Detail Laporan {reportPeriod === 'daily' ? 'Harian' : reportPeriod === 'weekly' ? 'Mingguan' : 'Bulanan'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[calc(100vh-350px)]">
                    <div className="space-y-3">
                      {salesReports.map((report: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-orange-500" />
                              <span className="font-semibold">{report.date}</span>
                            </div>
                            <Badge variant="outline">{report.orders} pesanan</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Penjualan</p>
                              <p className="font-bold text-green-600 text-lg">Rp {report.total.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Item Terjual</p>
                              <p className="font-bold text-lg">{report.itemsSold}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {salesReports.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">Belum ada data laporan</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Pelanggan</h1>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari pelanggan..." className="pl-10" />
                </div>
              </div>

              <ScrollArea className="max-h-[calc(100vh-250px)]">
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <Card key={customer.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-xl">👤</span>
                            </div>
                            <div>
                              <p className="font-bold text-lg">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{customer.role}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-muted-foreground text-sm">No. HP</p>
                            <p className="font-medium">{customer.phone}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-muted-foreground text-sm">Poin</p>
                            <p className="font-medium">{customer.member?.points || 0}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-muted-foreground text-sm">Tier</p>
                            <p className="font-medium">{customer.member?.tier || 'Regular'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {customers.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">Belum ada pelanggan</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Cashiers Tab */}
          {activeTab === 'cashiers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Kasir</h1>
                <Dialog open={isAddCashierOpen} onOpenChange={setIsAddCashierOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Tambah Kasir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Kasir Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nama Lengkap</Label>
                        <Input
                          value={cashierForm.name}
                          onChange={(e) => setCashierForm({ ...cashierForm, name: e.target.value })}
                          placeholder="Nama Kasir"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={cashierForm.email}
                          onChange={(e) => setCashierForm({ ...cashierForm, email: e.target.value })}
                          placeholder="kasir@ayamgeprek.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>No. HP</Label>
                        <Input
                          value={cashierForm.phone}
                          onChange={(e) => setCashierForm({ ...cashierForm, phone: e.target.value })}
                          placeholder="08123456789"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          value={cashierForm.password}
                          onChange={(e) => setCashierForm({ ...cashierForm, password: e.target.value })}
                          placeholder="•••••••••"
                        />
                      </div>
                      <Button onClick={handleAddCashier} className="w-full bg-orange-500 hover:bg-orange-600">
                        Tambah Kasir
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cashiers.map((cashier) => (
                  <Card key={cashier.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">👨‍💼</span>
                        </div>
                        <div>
                          <p className="font-bold text-lg">{cashier.name}</p>
                          <p className="text-sm text-muted-foreground">{cashier.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">No. HP:</span>
                          <span className="font-medium">{cashier.phone}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Role:</span>
                          <Badge variant="secondary">{cashier.role}</Badge>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDeleteCashier(cashier.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Kasir
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {cashiers.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-12">Belum ada kasir</p>
                )}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Chat dengan Pelanggan</h1>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
                {/* User List */}
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardContent className="p-0">
                      <ScrollArea className="h-full">
                        <div className="space-y-1">
                          {allUserChats.map((chat) => (
                            <button
                              key={chat.userId}
                              onClick={() => loadUserChat(chat.userId)}
                              className={`w-full text-left p-4 transition-colors ${
                                selectedUserChat === chat.userId
                                  ? 'bg-orange-500 text-white'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <p className="font-semibold text-sm truncate">{chat.user?.name || 'User'}</p>
                              <p className="text-xs opacity-80 truncate">{chat.user?.phone || ''}</p>
                              {chat.unreadCount > 0 && (
                                <Badge className={`mt-1 ${selectedUserChat === chat.userId ? 'bg-white text-orange-500' : ''}`}>
                                  {chat.unreadCount} pesan baru
                                </Badge>
                              )}
                            </button>
                          ))}
                          {allUserChats.length === 0 && (
                            <p className="text-center text-muted-foreground text-sm py-8">Belum ada percakapan</p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Chat Messages */}
                <div className="lg:col-span-3">
                  <Card className="h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="p-4 border-b bg-gray-50">
                        <p className="font-semibold text-lg">
                          {allUserChats.find(c => c.userId === selectedUserChat)?.user?.name || 'Pilih User'}
                        </p>
                      </div>
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {chatMessages.map((msg) => {
                            const isAdmin = msg.senderRole === 'admin'
                            return (
                              <div key={msg.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${
                                  isAdmin
                                    ? 'bg-gray-200 rounded-tl-none'
                                    : 'bg-orange-500 text-white rounded-tr-none'
                                }`}>
                                  <p className="text-sm">{msg.message}</p>
                                  <p className={`text-xs mt-2 ${isAdmin ? 'text-muted-foreground' : 'text-white/80'}`}>
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
                      <div className="p-4 border-t">
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
                            <Send className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Notifikasi</h1>
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
                          rows={4}
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
                  <ScrollArea className="max-h-[calc(100vh-350px)]">
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <Card key={notif.id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{notif.title}</p>
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
                        <p className="text-center text-muted-foreground text-sm py-12">Belum ada notifikasi</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
