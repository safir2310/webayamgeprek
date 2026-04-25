'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Phone,
  Mail,
  User,
  RefreshCw,
  UserCog,
  Gift,
  Bell,
  MessageCircle,
  Percent,
  Ticket,
  Star,
  Sparkles
} from 'lucide-react'

type TabType = 'dashboard' | 'orders' | 'products' | 'categories' | 'features' | 'featured' | 'promos' | 'vouchers' | 'stock' | 'users' | 'cashiers' | 'payments' | 'redeem' | 'reports' | 'settings' | 'notifications' | 'chat'

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
  lowStock: number
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')

  // Orders state
  const [orders, setOrders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Products state
  const [products, setProducts] = useState<any[]>([])
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productImagePreview, setProductImagePreview] = useState<string>('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    image: '',
    barcode: ''
  })

  // Categories state
  const [categories, setCategories] = useState<any[]>([])
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: ''
  })

  // Users state
  const [users, setUsers] = useState<any[]>([])

  // Cashiers state
  const [cashiers, setCashiers] = useState<any[]>([])
  const [showCashierDialog, setShowCashierDialog] = useState(false)
  const [editingCashier, setEditingCashier] = useState<any>(null)
  const [newCashier, setNewCashier] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

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

  // Reports state
  const [reports, setReports] = useState<any[]>([])
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('all')
  const [showGenerateReportDialog, setShowGenerateReportDialog] = useState(false)
  const [newReport, setNewReport] = useState({
    type: 'daily',
    date: new Date().toISOString().split('T')[0]
  })
  const [selectedReport, setSelectedReport] = useState<any>(null)

  // Featured products state
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

  // Features state
  const [features, setFeatures] = useState<any[]>([])
  const [showFeatureDialog, setShowFeatureDialog] = useState(false)
  const [editingFeature, setEditingFeature] = useState<any>(null)
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    icon: '',
    badge: '',
    isActive: true,
    sortOrder: 0
  })

  // Promos state
  const [promos, setPromos] = useState<any[]>([])
  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [editingPromo, setEditingPromo] = useState<any>(null)
  const [newPromo, setNewPromo] = useState({
    name: '',
    description: '',
    discountPercent: 0,
    startDate: '',
    endDate: '',
    minPurchase: 0,
    isActive: true
  })

  // Vouchers state
  const [vouchers, setVouchers] = useState<any[]>([])
  const [showVoucherDialog, setShowVoucherDialog] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState<any>(null)
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    description: '',
    discountPercent: 0,
    maxDiscount: 0,
    minPurchase: 0,
    usageLimit: 0,
    startDate: '',
    endDate: '',
    isActive: true
  })

  // Settings state
  const [settings, setSettings] = useState<any>({
    storeName: 'Ayam Geprek Sambal Ijo',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    openingHours: '',
    taxRate: 10,
    serviceCharge: 0
  })

  useEffect(() => {
    loadDashboardStats()
    loadNotifications()
    loadOrders()
    loadProducts()
    loadCategories()
    loadUsers()
    loadCashiers()
    loadPaymentMethods()
    loadRedeemProducts()
    loadChatMessages()
    loadReports()
    loadFeaturedProducts()
    loadFeatures()
    loadPromos()
    loadVouchers()
    loadSettings()
  }, [])

  useEffect(() => {
    loadReports()
  }, [reportTypeFilter])

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      if (response.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      const data = await response.json()
      if (response.ok && data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      if (response.ok && data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (response.ok && data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (response.ok && data.categories) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      if (response.ok && data.customers) {
        setUsers(data.customers)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const loadCashiers = async () => {
    try {
      const response = await fetch('/api/admin/cashiers')
      const data = await response.json()
      if (response.ok && data.cashiers) {
        setCashiers(data.cashiers)
      }
    } catch (error) {
      console.error('Failed to load cashiers:', error)
    }
  }

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods')
      const data = await response.json()
      if (response.ok && data.paymentMethods) {
        setPaymentMethods(data.paymentMethods)
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error)
    }
  }

  const loadRedeemProducts = async () => {
    try {
      const response = await fetch('/api/redeem-products')
      const data = await response.json()
      if (response.ok && data.redeemProducts) {
        setRedeemProducts(data.redeemProducts)
      }
    } catch (error) {
      console.error('Failed to load redeem products:', error)
    }
  }

  const loadChatMessages = async () => {
    try {
      const response = await fetch('/api/admin/chats')
      const data = await response.json()
      if (response.ok && data.chats) {
        // Sort by createdAt ascending for chat display
        const sortedMessages = [...data.chats].sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        setChatMessages(sortedMessages)
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error)
    }
  }

  const loadReports = async () => {
    try {
      const typeParam = reportTypeFilter !== 'all' ? `?type=${reportTypeFilter}` : ''
      const response = await fetch(`/api/admin/reports${typeParam}`)
      const data = await response.json()
      if (response.ok && data.reports) {
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Failed to load reports:', error)
    }
  }

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      })

      if (response.ok) {
        const data = await response.json()
        setShowGenerateReportDialog(false)
        toast({
          title: 'Berhasil',
          description: 'Laporan berhasil dibuat',
        })
        loadReports()
      } else {
        toast({
          title: 'Gagal',
          description: 'Gagal membuat laporan',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat membuat laporan',
        variant: 'destructive'
      })
    }
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
        return 'bg-green-100 text-green-700 border-green-200'
      case 'paid':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'paid':
        return 'Dibayar'
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

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length

  const sendChatMessage = () => {
    if (!chatInput.trim()) return

    setChatMessages(prev => [...prev, {
      id: String(Date.now()),
      senderRole: 'admin',
      message: chatInput,
      isRead: false,
      createdAt: new Date()
    }])
    setChatInput('')

    toast({
      title: 'Pesan Terkirim',
      description: 'Pesan Anda telah terkirim',
    })
  }

  // Order status handlers
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/order/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ))
        toast({
          title: 'Berhasil',
          description: `Status pesanan telah diubah menjadi ${getStatusLabel(newStatus)}`,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: 'Gagal',
          description: errorData.error || 'Terjadi kesalahan saat mengubah status',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mengubah status',
        variant: 'destructive'
      })
    }
  }

  // Product handlers
  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct)
        })

        if (response.ok) {
          setProducts(products.map(p =>
            p.id === editingProduct.id ? { ...p, ...newProduct } : p
          ))
          setShowProductDialog(false)
          setEditingProduct(null)
          toast({
            title: 'Berhasil',
            description: 'Produk telah diperbarui',
          })
        }
      } else {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newProduct, isActive: true })
        })

        if (response.ok) {
          const data = await response.json()
          setProducts([...products, data.product])
          setShowProductDialog(false)
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

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
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

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Gagal',
          description: 'Mohon pilih file gambar',
          variant: 'destructive'
        })
        return
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Gagal',
          description: 'Ukuran gambar maksimal 2MB',
          variant: 'destructive'
        })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProductImagePreview(base64String)
        setNewProduct({ ...newProduct, image: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProductImage = () => {
    setProductImagePreview('')
    setNewProduct({ ...newProduct, image: '' })
  }

  // Category handlers
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCategory)
        })

        if (response.ok) {
          setCategories(categories.map(c =>
            c.id === editingCategory.id ? { ...c, ...newCategory } : c
          ))
          setShowCategoryDialog(false)
          setEditingCategory(null)
          toast({
            title: 'Berhasil',
            description: 'Kategori telah diperbarui',
          })
        }
      } else {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCategory)
        })

        if (response.ok) {
          const data = await response.json()
          setCategories([...categories, data.category])
          setShowCategoryDialog(false)
          toast({
            title: 'Berhasil',
            description: 'Kategori baru telah ditambahkan',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan kategori',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== id))
        toast({
          title: 'Berhasil',
          description: 'Kategori telah dihapus',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus kategori',
        variant: 'destructive'
      })
    }
  }

  // Cashier handlers
  const handleSaveCashier = async () => {
    try {
      if (editingCashier) {
        const response = await fetch(`/api/admin/cashiers/${editingCashier.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCashier)
        })

        if (response.ok) {
          setCashiers(cashiers.map(c =>
            c.id === editingCashier.id ? { ...c, ...newCashier } : c
          ))
          setShowCashierDialog(false)
          setEditingCashier(null)
          toast({
            title: 'Berhasil',
            description: 'Kasir telah diperbarui',
          })
        }
      } else {
        const response = await fetch('/api/admin/cashiers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newCashier, role: 'cashier' })
        })

        if (response.ok) {
          const data = await response.json()
          setCashiers([...cashiers, data.cashier])
          setShowCashierDialog(false)
          toast({
            title: 'Berhasil',
            description: 'Kasir baru telah ditambahkan',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan kasir',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteCashier = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kasir ini?')) return

    try {
      const response = await fetch(`/api/admin/cashiers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCashiers(cashiers.filter(c => c.id !== id))
        toast({
          title: 'Berhasil',
          description: 'Kasir telah dihapus',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus kasir',
        variant: 'destructive'
      })
    }
  }

  // Payment method handlers
  const handleTogglePaymentMethod = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        setPaymentMethods(paymentMethods.map(pm =>
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

  // Featured Products handlers
  const loadFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/admin/featured-products')
      const data = await response.json()
      if (response.ok && data.featuredProducts) {
        setFeaturedProducts(data.featuredProducts)
      }
    } catch (error) {
      console.error('Failed to load featured products:', error)
    }
  }

  const handleToggleFeatured = async (productId: string, isCurrentlyFeatured: boolean) => {
    try {
      const response = await fetch('/api/admin/featured-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isFeatured: !isCurrentlyFeatured })
      })

      if (response.ok) {
        loadFeaturedProducts()
        toast({
          title: 'Berhasil',
          description: isCurrentlyFeatured ? 'Produk dihapus dari unggulan' : 'Produk ditambahkan ke unggulan',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mengubah status unggulan',
        variant: 'destructive'
      })
    }
  }

  // Features handlers
  const loadFeatures = async () => {
    try {
      const response = await fetch('/api/admin/features')
      const data = await response.json()
      if (response.ok) {
        setFeatures(data)
      }
    } catch (error) {
      console.error('Failed to load features:', error)
    }
  }

  const handleSaveFeature = async () => {
    try {
      if (editingFeature) {
        const response = await fetch(`/api/admin/features/${editingFeature.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFeature)
        })

        if (response.ok) {
          setFeatures(features.map(f =>
            f.id === editingFeature.id ? { ...f, ...newFeature } : f
          ))
          setShowFeatureDialog(false)
          setEditingFeature(null)
          toast({
            title: 'Berhasil',
            description: 'Fitur telah diperbarui',
          })
        }
      } else {
        const response = await fetch('/api/admin/features', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newFeature, sortOrder: features.length + 1 })
        })

        if (response.ok) {
          const data = await response.json()
          setFeatures([...features, data])
          setShowFeatureDialog(false)
          toast({
            title: 'Berhasil',
            description: 'Fitur baru telah ditambahkan',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan fitur',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus fitur ini?')) return

    try {
      const response = await fetch(`/api/admin/features/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFeatures(features.filter(f => f.id !== id))
        toast({
          title: 'Berhasil',
          description: 'Fitur telah dihapus',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus fitur',
        variant: 'destructive'
      })
    }
  }

  const handleEditFeature = (feature: any) => {
    setEditingFeature(feature)
    setNewFeature({
      title: feature.title,
      description: feature.description || '',
      icon: feature.icon || '',
      badge: feature.badge || '',
      isActive: feature.isActive,
      sortOrder: feature.sortOrder
    })
    setShowFeatureDialog(true)
  }

  // Promos handlers
  const loadPromos = async () => {
    try {
      const response = await fetch('/api/admin/promos')
      const data = await response.json()
      if (response.ok && data.promos) {
        setPromos(data.promos)
      }
    } catch (error) {
      console.error('Failed to load promos:', error)
    }
  }

  const handleSavePromo = async () => {
    try {
      if (editingPromo) {
        const response = await fetch(`/api/admin/promos/${editingPromo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPromo)
        })

        if (response.ok) {
          setPromos(promos.map(p =>
            p.id === editingPromo.id ? { ...p, ...newPromo } : p
          ))
          setShowPromoDialog(false)
          setEditingPromo(null)
          toast({
            title: 'Berhasil',
            description: 'Promo telah diperbarui',
          })
        }
      } else {
        const response = await fetch('/api/admin/promos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPromo)
        })

        if (response.ok) {
          const data = await response.json()
          setPromos([...promos, data.promo])
          setShowPromoDialog(false)
          toast({
            title: 'Berhasil',
            description: 'Promo baru telah ditambahkan',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan promo',
        variant: 'destructive'
      })
    }
  }

  const handleDeletePromo = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus promo ini?')) return

    try {
      const response = await fetch(`/api/admin/promos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPromos(promos.filter(p => p.id !== id))
        toast({
          title: 'Berhasil',
          description: 'Promo telah dihapus',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus promo',
        variant: 'destructive'
      })
    }
  }

  const handleEditPromo = (promo: any) => {
    setEditingPromo(promo)
    setNewPromo({
      name: promo.name,
      description: promo.description,
      discountPercent: promo.discountPercent,
      startDate: new Date(promo.startDate).toISOString().split('T')[0],
      endDate: new Date(promo.endDate).toISOString().split('T')[0],
      minPurchase: promo.minPurchase,
      isActive: promo.isActive
    })
    setShowPromoDialog(true)
  }

  // Vouchers handlers
  const loadVouchers = async () => {
    try {
      const response = await fetch('/api/admin/vouchers')
      const data = await response.json()
      if (response.ok && data.vouchers) {
        setVouchers(data.vouchers)
      }
    } catch (error) {
      console.error('Failed to load vouchers:', error)
    }
  }

  const handleSaveVoucher = async () => {
    try {
      if (editingVoucher) {
        const response = await fetch(`/api/admin/vouchers/${editingVoucher.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVoucher)
        })

        if (response.ok) {
          setVouchers(vouchers.map(v =>
            v.id === editingVoucher.id ? { ...v, ...newVoucher } : v
          ))
          setShowVoucherDialog(false)
          setEditingVoucher(null)
          toast({
            title: 'Berhasil',
            description: 'Voucher telah diperbarui',
          })
        }
      } else {
        const response = await fetch('/api/admin/vouchers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newVoucher, code: newVoucher.code.toUpperCase() })
        })

        if (response.ok) {
          const data = await response.json()
          setVouchers([...vouchers, data.voucher])
          setShowVoucherDialog(false)
          toast({
            title: 'Berhasil',
            description: 'Voucher baru telah ditambahkan',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan voucher',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus voucher ini?')) return

    try {
      const response = await fetch(`/api/admin/vouchers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setVouchers(vouchers.filter(v => v.id !== id))
        toast({
          title: 'Berhasil',
          description: 'Voucher telah dihapus',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus voucher',
        variant: 'destructive'
      })
    }
  }

  const handleEditVoucher = (voucher: any) => {
    setEditingVoucher(voucher)
    setNewVoucher({
      code: voucher.code,
      description: voucher.description,
      discountPercent: voucher.discountPercent,
      maxDiscount: voucher.maxDiscount,
      minPurchase: voucher.minPurchase,
      usageLimit: voucher.usageLimit,
      startDate: new Date(voucher.startDate).toISOString().split('T')[0],
      endDate: new Date(voucher.endDate).toISOString().split('T')[0],
      isActive: voucher.isActive
    })
    setShowVoucherDialog(true)
  }

  // Settings handlers
  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      if (response.ok && data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast({
          title: 'Berhasil',
          description: 'Pengaturan telah disimpan',
        })
      } else {
        toast({
          title: 'Gagal',
          description: 'Gagal menyimpan pengaturan',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan pengaturan',
        variant: 'destructive'
      })
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout
      currentTab={activeTab}
      onTabChange={setActiveTab}
      notifications={notifications}
      unreadNotificationCount={unreadNotificationCount}
    >
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600 mt-1">Ringkasan aktivitas restoran Anda</p>
            </div>
            <Button onClick={loadDashboardStats} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Penjualan</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalSales || 0)}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Hari ini: {formatCurrency(stats?.todaySales || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Hari ini: {stats?.todayOrders || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Produk</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                    <p className="text-xs text-yellow-600 mt-1 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Stok menipis: {stats?.lowStock || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Pelanggan</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Pengguna aktif
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Menunggu</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      {stats?.pendingOrders || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Diproses</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      {stats?.processingOrders || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Selesai</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {stats?.completedOrders || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Pesanan Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {orders.slice(0, 10).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">{order.orderNumber}</span>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{order.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Belum ada pesanan</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Pesanan</h2>
              <p className="text-gray-600 mt-1">Kelola semua pesanan masuk</p>
            </div>
            <Button onClick={loadOrders} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari pesanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="paid">Dibayar</SelectItem>
                    <SelectItem value="processing">Diproses</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{order.orderNumber}</span>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-500">Pelanggan</p>
                                <p className="font-medium">{order.user?.name || 'Guest'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Tanggal</p>
                                <p className="font-medium">
                                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Pembayaran</p>
                                <p className="font-medium capitalize">{order.paymentMethod}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Total</p>
                                <p className="font-bold text-orange-600">{formatCurrency(order.total)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {order.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                                  variant="outline"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  Dibayar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                  variant="outline"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Proses
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                  variant="destructive"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Batalkan
                                </Button>
                              </>
                            )}
                            {order.status === 'paid' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                  variant="outline"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Proses
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                  variant="destructive"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Batalkan
                                </Button>
                              </>
                            )}
                            {order.status === 'processing' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Selesai
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                  variant="destructive"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Batalkan
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // View order details - TODO: implement detail view
                                toast({
                                  title: 'Detail Pesanan',
                                  description: `Nomor pesanan: ${order.orderNumber}`,
                                })
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Detail
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">Tidak ada pesanan ditemukan</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Produk</h2>
              <p className="text-gray-600 mt-1">Kelola semua produk menu</p>
            </div>
            <Button
              onClick={() => {
                setEditingProduct(null)
                setProductImagePreview('')
                setNewProduct({
                  name: '',
                  description: '',
                  price: 0,
                  stock: 0,
                  categoryId: '',
                  image: '',
                  barcode: ''
                })
                setShowProductDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>'
                                  }
                                }}
                              />
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-1">{product.description || 'Tidak ada deskripsi'}</p>
                              </div>
                              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                {product.isActive ? 'Aktif' : 'Nonaktif'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Kategori</p>
                                <p className="font-medium">{categories.find(c => c.id === product.categoryId)?.name || '-'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Harga</p>
                                <p className="font-bold text-orange-600">{formatCurrency(product.price)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Stok</p>
                                <Badge variant={product.stock < 20 ? 'destructive' : 'default'}>
                                  {product.stock}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-gray-500">Barcode</p>
                                <p className="font-medium">{product.barcode || '-'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                setEditingProduct(product)
                                setProductImagePreview(product.image || '')
                                setNewProduct({
                                  name: product.name,
                                  description: product.description || '',
                                  price: product.price,
                                  stock: product.stock,
                                  categoryId: product.categoryId,
                                  image: product.image || '',
                                  barcode: product.barcode || ''
                                })
                                setShowProductDialog(true)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">Tidak ada produk ditemukan</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Kategori</h2>
              <p className="text-gray-600 mt-1">Kelola kategori produk</p>
            </div>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setNewCategory({ name: '', description: '', image: '' })
                setShowCategoryDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {category.image ? (
                        <span className="text-2xl">{category.image}</span>
                      ) : (
                        <Package className="h-6 w-6 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{category.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{category.description || 'Tidak ada deskripsi'}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {products.filter(p => p.categoryId === category.id).length} produk
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEditingCategory(category)
                        setNewCategory({
                          name: category.name,
                          description: category.description || '',
                          image: category.image || ''
                        })
                        setShowCategoryDialog(true)
                      }}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada kategori</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Fitur Terbaru</h2>
              <p className="text-gray-600 mt-1">Kelola fitur-fitur terbaru untuk ditampilkan di aplikasi</p>
            </div>
            <Button
              onClick={() => {
                setEditingFeature(null)
                setNewFeature({ title: '', description: '', icon: '', badge: '', isActive: true, sortOrder: 0 })
                setShowFeatureDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Fitur
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Card key={feature.id} className={`hover:shadow-md transition-shadow ${!feature.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon ? (
                        <span className="text-2xl">{feature.icon}</span>
                      ) : (
                        <Sparkles className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg truncate">{feature.title}</h3>
                        {feature.badge && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{feature.description || 'Tidak ada deskripsi'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={feature.isActive ? 'default' : 'secondary'}>
                          {feature.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                        <span className="text-xs text-gray-500">Urutan: {feature.sortOrder}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditFeature(feature)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteFeature(feature.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {features.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada fitur</p>
              </div>
            )}
          </div>

          {/* Feature Dialog */}
          <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingFeature ? 'Edit Fitur' : 'Tambah Fitur Baru'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="feature-title">Judul Fitur *</Label>
                  <Input
                    id="feature-title"
                    value={newFeature.title}
                    onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                    placeholder="Contoh: Pesan Online"
                  />
                </div>
                <div>
                  <Label htmlFor="feature-description">Deskripsi</Label>
                  <Textarea
                    id="feature-description"
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                    placeholder="Deskripsi fitur"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="feature-icon">Icon (Emoji)</Label>
                  <Input
                    id="feature-icon"
                    value={newFeature.icon}
                    onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                    placeholder="Contoh: 🚀, 💡, ✨"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="feature-badge">Badge</Label>
                  <Input
                    id="feature-badge"
                    value={newFeature.badge}
                    onChange={(e) => setNewFeature({ ...newFeature, badge: e.target.value })}
                    placeholder="Contoh: New, Hot, Popular"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="feature-active"
                    checked={newFeature.isActive}
                    onCheckedChange={(checked) => setNewFeature({ ...newFeature, isActive: checked })}
                  />
                  <Label htmlFor="feature-active">Aktif</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowFeatureDialog(false)}>
                  Batal
                </Button>
                <Button onClick={handleSaveFeature}>
                  {editingFeature ? 'Simpan Perubahan' : 'Tambah Fitur'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Stock Tab */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Stok</h2>
            <p className="text-gray-600 mt-1">Pantau dan kelola stok produk</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto text-orange-500 mb-3" />
                  <p className="text-3xl font-bold text-gray-900">
                    {products.reduce((sum, p) => sum + p.stock, 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Stok Produk</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-3" />
                  <p className="text-3xl font-bold text-red-600">
                    {products.filter(p => p.stock < 20).length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Produk Menipis</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Produk dengan Stok Menipis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.filter(p => p.stock < 20).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{categories.find(c => c.id === product.categoryId)?.name || '-'}</p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                      Stok: {product.stock}
                    </Badge>
                  </div>
                ))}
                {products.filter(p => p.stock < 20).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-300" />
                    <p>Semua stok dalam kondisi baik</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Pelanggan</h2>
            <p className="text-gray-600 mt-1">Kelola data pelanggan</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      <p className="text-sm text-gray-600 truncate flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {user.phone}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t text-center">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        {orders.filter(o => o.userId === user.id).length}
                      </p>
                      <p className="text-xs text-gray-600">Pesanan</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(orders.filter(o => o.userId === user.id).reduce((sum, o) => sum + o.total, 0))}
                      </p>
                      <p className="text-xs text-gray-600">Total Belanja</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {users.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada pelanggan</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cashiers Tab */}
      {activeTab === 'cashiers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Kasir</h2>
              <p className="text-gray-600 mt-1">Kelola akun kasir</p>
            </div>
            <Button
              onClick={() => {
                setEditingCashier(null)
                setNewCashier({ name: '', email: '', phone: '', password: '' })
                setShowCashierDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kasir
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cashiers.map((cashier) => (
              <Card key={cashier.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{cashier.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{cashier.email}</p>
                      <p className="text-sm text-gray-600 truncate flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {cashier.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEditingCashier(cashier)
                        setNewCashier({
                          name: cashier.name,
                          email: cashier.email,
                          phone: cashier.phone,
                          password: ''
                        })
                        setShowCashierDialog(true)
                      }}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCashier(cashier.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {cashiers.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <UserCog className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada kasir</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Metode Pembayaran</h2>
              <p className="text-gray-600 mt-1">Kelola metode pembayaran yang tersedia</p>
            </div>
            <Button
              onClick={() => {
                setEditingPayment(null)
                setNewPayment({ name: '', displayName: '', description: '', icon: '' })
                setShowPaymentDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Metode
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((pm) => (
              <Card key={pm.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {pm.icon ? (
                          <span className="text-2xl">{pm.icon}</span>
                        ) : (
                          <DollarSign className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{pm.displayName}</p>
                        <Badge variant={pm.isActive ? 'default' : 'secondary'}>
                          {pm.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{pm.description || 'Tidak ada deskripsi'}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleTogglePaymentMethod(pm.id, pm.isActive)}
                    >
                      {pm.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePaymentMethod(pm.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {paymentMethods.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada metode pembayaran</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Redeem Tab */}
      {activeTab === 'redeem' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Produk Tukar Poin</h2>
              <p className="text-gray-600 mt-1">Kelola produk yang dapat ditukar dengan poin</p>
            </div>
            <Button
              onClick={() => {
                setEditingRedeem(null)
                setNewRedeemProduct({ name: '', description: '', points: 0, image: '', stock: -1 })
                setShowRedeemDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {redeemProducts.map((rp) => (
              <Card key={rp.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {rp.image ? (
                        <span className="text-2xl">{rp.image}</span>
                      ) : (
                        <Gift className="h-6 w-6 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">{rp.name}</h3>
                        <Badge variant={rp.isActive ? 'default' : 'secondary'}>
                          {rp.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{rp.description || 'Tidak ada deskripsi'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{rp.points}</p>
                      <p className="text-xs text-gray-600">Poin</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {rp.stock === -1 ? '∞' : rp.stock}
                      </p>
                      <p className="text-xs text-gray-600">Stok</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleToggleRedeemProduct(rp.id, rp.isActive)}
                    >
                      {rp.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditRedeemProduct(rp)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRedeemProduct(rp.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {redeemProducts.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Gift className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada produk tukar poin</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Laporan Penjualan</h2>
              <p className="text-gray-600 mt-1">Rekap dan analisis laporan penjualan</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadReports} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowGenerateReportDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Buat Laporan
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="daily">Harian</SelectItem>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedReport(report)}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={
                                report.type === 'daily' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                report.type === 'weekly' ? 'bg-green-100 text-green-700 border-green-200' :
                                'bg-purple-100 text-purple-700 border-purple-200'
                              }>
                                {report.type === 'daily' ? 'Harian' :
                                 report.type === 'weekly' ? 'Mingguan' :
                                 'Bulanan'}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(report.reportDate).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500">Total Penjualan</p>
                                <p className="font-bold text-orange-600">{formatCurrency(report.totalSales)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Total Pesanan</p>
                                <p className="font-medium">{report.totalOrders}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Total Item</p>
                                <p className="font-medium">{report.totalItems}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Rata-rata</p>
                                <p className="font-medium">{formatCurrency(report.averageOrderValue)}</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedReport(report)
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Detail
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {reports.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">Belum ada laporan</p>
                      <p className="text-sm mt-2">Klik "Buat Laporan" untuk memulai</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Featured Products Tab */}
      {activeTab === 'featured' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Produk Unggulan</h2>
              <p className="text-gray-600 mt-1">Kelola produk yang ditampilkan di halaman utama</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => {
              const isFeatured = featuredProducts.some(fp => fp.productId === product.id)
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-orange-600 font-medium">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant={isFeatured ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => handleToggleFeatured(product.id, isFeatured)}
                      >
                        <Star className={`h-3 w-3 mr-1 ${isFeatured ? 'fill-yellow-400' : ''}`} />
                        {isFeatured ? 'Unggulan' : 'Set Unggulan'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {products.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada produk</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promos Tab */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Promo</h2>
              <p className="text-gray-600 mt-1">Kelola promo dan diskon</p>
            </div>
            <Button onClick={() => {
              setEditingPromo(null)
              setNewPromo({
                name: '',
                description: '',
                discountPercent: 0,
                startDate: '',
                endDate: '',
                minPurchase: 0,
                isActive: true
              })
              setShowPromoDialog(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Promo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promos.map((promo) => (
              <Card key={promo.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge className={promo.isActive ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}>
                      {promo.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    <Switch
                      checked={promo.isActive}
                      onCheckedChange={(checked) => {
                        const response = fetch(`/api/admin/promos/${promo.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...promo, isActive: checked })
                        }).then(res => {
                          if (res.ok) {
                            loadPromos()
                            toast({
                              title: 'Berhasil',
                              description: checked ? 'Promo diaktifkan' : 'Promo dinonaktifkan',
                            })
                          }
                        })
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{promo.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{promo.description || 'Tidak ada deskripsi'}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Diskon</span>
                      <span className="font-bold text-orange-600">{promo.discountPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min. Belanja</span>
                      <span className="font-medium">{formatCurrency(promo.minPurchase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Periode</span>
                      <span className="font-medium text-xs">
                        {new Date(promo.startDate).toLocaleDateString('id-ID')} - {new Date(promo.endDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditPromo(promo)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePromo(promo.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {promos.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Percent className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada promo</p>
                <p className="text-sm mt-2">Klik "Tambah Promo" untuk memulai</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vouchers Tab */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Voucher</h2>
              <p className="text-gray-600 mt-1">Kelola kode voucher diskon</p>
            </div>
            <Button onClick={() => {
              setEditingVoucher(null)
              setNewVoucher({
                code: '',
                description: '',
                discountPercent: 0,
                maxDiscount: 0,
                minPurchase: 0,
                usageLimit: 0,
                startDate: '',
                endDate: '',
                isActive: true
              })
              setShowVoucherDialog(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Voucher
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vouchers.map((voucher) => (
              <Card key={voucher.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg p-3 mb-3">
                    <Ticket className="h-6 w-6 text-white mb-2" />
                    <p className="text-2xl font-bold text-white tracking-wider">{voucher.code}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{voucher.description || 'Tidak ada deskripsi'}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Diskon</span>
                      <span className="font-bold text-orange-600">{voucher.discountPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Maks. Diskon</span>
                      <span className="font-medium">{formatCurrency(voucher.maxDiscount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min. Belanja</span>
                      <span className="font-medium">{formatCurrency(voucher.minPurchase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Batas Penggunaan</span>
                      <span className="font-medium">{voucher.usageLimit || '∞'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditVoucher(voucher)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteVoucher(voucher.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {vouchers.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Ticket className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada voucher</p>
                <p className="text-sm mt-2">Klik "Tambah Voucher" untuk memulai</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Pengaturan</h2>
            <p className="text-gray-600 mt-1">Pengaturan restoran dan sistem</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nama Toko</Label>
                <Input
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  placeholder="Nama toko"
                />
              </div>
              <div>
                <Label>Alamat</Label>
                <Textarea
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  placeholder="Alamat lengkap toko"
                  rows={3}
                />
              </div>
              <div>
                <Label>Nomor Telepon</Label>
                <Input
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  placeholder="Nomor telepon toko"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  placeholder="Email toko"
                />
              </div>
              <div>
                <Label>Jam Operasional</Label>
                <Input
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  placeholder="Contoh: 09:00 - 22:00"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Pajak (%)</Label>
                <Input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                  placeholder="Persentase pajak"
                />
              </div>
              <div>
                <Label>Biaya Layanan (%)</Label>
                <Input
                  type="number"
                  value={settings.serviceCharge}
                  onChange={(e) => setSettings({ ...settings, serviceCharge: parseFloat(e.target.value) || 0 })}
                  placeholder="Persentase biaya layanan"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button onClick={handleSaveSettings} className="min-w-[150px]">
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Notifikasi</h2>
              <p className="text-gray-600 mt-1">Riwayat notifikasi sistem</p>
            </div>
            <Button onClick={loadNotifications} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <Card key={notif.id} className={`hover:shadow-md transition-shadow ${!notif.isRead ? 'border-l-4 border-l-orange-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notif.type === 'order' ? 'bg-green-100' :
                      notif.type === 'warning' ? 'bg-yellow-100' :
                      notif.type === 'error' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {notif.type === 'order' ? <ShoppingCart className="h-5 w-5 text-green-600" /> :
                       notif.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-600" /> :
                       notif.type === 'error' ? <XCircle className="h-5 w-5 text-red-600" /> :
                       <Bell className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{notif.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        </div>
                        {!notif.isRead && (
                          <Badge variant="default" className="flex-shrink-0">Baru</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Belum ada notifikasi</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Chat</h2>
              <p className="text-gray-600 mt-1">Komunikasi dengan pelanggan</p>
            </div>
            <Button onClick={loadChatMessages} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Card className="h-[calc(100vh-300px)] flex flex-col">
            <CardContent className="flex-1 p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.senderRole === 'admin' ? '' : 'justify-end'}`}>
                      {msg.senderRole === 'admin' ? (
                        <>
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">👨‍💼</span>
                          </div>
                          <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-white/80 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">👤</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {chatMessages.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">Belum ada pesan</p>
                    </div>
                  )}
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
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nama Produk</Label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Nama produk"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Deskripsi produk"
                rows={3}
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={newProduct.categoryId} onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}>
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
            <div>
              <Label>Harga</Label>
              <Input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                placeholder="Harga produk"
              />
            </div>
            <div>
              <Label>Stok</Label>
              <Input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                placeholder="Jumlah stok"
              />
            </div>
            <div>
              <Label>Barcode</Label>
              <Input
                value={newProduct.barcode}
                onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                placeholder="Barcode (opsional)"
              />
            </div>
            <div>
              <Label>Gambar Produk</Label>
              <div className="space-y-3">
                {/* File Upload from Gallery */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('product-image-upload')?.click()}
                    className="flex-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload dari Galeri
                  </Button>
                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                  {productImagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveProductImage}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Image Preview */}
                {productImagePreview && (
                  <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <img
                      src={productImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* URL Input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Atau masukkan URL</span>
                  </div>
                </div>
                <Input
                  value={newProduct.image && !productImagePreview ? newProduct.image : ''}
                  onChange={(e) => {
                    setProductImagePreview(e.target.value)
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }}
                  placeholder="URL gambar produk"
                  disabled={!!productImagePreview}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowProductDialog(false)
              setEditingProduct(null)
              setProductImagePreview('')
            }}>
              Batal
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? 'Update' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nama Kategori</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Nama kategori"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Deskripsi kategori"
                rows={3}
              />
            </div>
            <div>
              <Label>Icon/Emoji</Label>
              <Input
                value={newCategory.image}
                onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                placeholder="🍗 atau biarkan kosong"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCategoryDialog(false)
              setEditingCategory(null)
            }}>
              Batal
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? 'Update' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cashier Dialog */}
      <Dialog open={showCashierDialog} onOpenChange={setShowCashierDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCashier ? 'Edit Kasir' : 'Tambah Kasir Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nama</Label>
              <Input
                value={newCashier.name}
                onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })}
                placeholder="Nama kasir"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newCashier.email}
                onChange={(e) => setNewCashier({ ...newCashier, email: e.target.value })}
                placeholder="Email kasir"
              />
            </div>
            <div>
              <Label>Nomor HP</Label>
              <Input
                value={newCashier.phone}
                onChange={(e) => setNewCashier({ ...newCashier, phone: e.target.value })}
                placeholder="Nomor HP kasir"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={newCashier.password}
                onChange={(e) => setNewCashier({ ...newCashier, password: e.target.value })}
                placeholder={editingCashier ? 'Biarkan kosong jika tidak ingin mengubah' : 'Password kasir'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCashierDialog(false)
              setEditingCashier(null)
            }}>
              Batal
            </Button>
            <Button onClick={handleSaveCashier}>
              {editingCashier ? 'Update' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
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

      {/* Redeem Product Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateReportDialog} onOpenChange={setShowGenerateReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Laporan Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tipe Laporan</Label>
              <Select value={newReport.type} onValueChange={(value) => setNewReport({ ...newReport, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tanggal Laporan</Label>
              <Input
                type="date"
                value={newReport.date}
                onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateReportDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleGenerateReport}>
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detail Laporan {selectedReport?.type === 'daily' ? 'Harian' : selectedReport?.type === 'weekly' ? 'Mingguan' : 'Bulanan'}
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6 py-4">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Penjualan</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(selectedReport.totalSales)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                    <p className="text-2xl font-bold text-green-600">{selectedReport.totalOrders}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Item</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedReport.totalItems}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Rata-rata Pesanan</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(selectedReport.averageOrderValue)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Pembayaran per Metode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Cash</span>
                      <span className="font-bold text-green-600">{formatCurrency(selectedReport.cashSales)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">QRIS</span>
                      <span className="font-bold text-blue-600">{formatCurrency(selectedReport.qrisSales)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Transfer</span>
                      <span className="font-bold text-purple-600">{formatCurrency(selectedReport.transferSales)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Selesai</p>
                      <p className="text-2xl font-bold text-green-600">{selectedReport.completedOrders}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Dibatalkan</p>
                      <p className="text-2xl font-bold text-red-600">{selectedReport.cancelledOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Selling Items */}
              {selectedReport.topSellingItems && (
                <Card>
                  <CardHeader>
                    <CardTitle>Produk Terlaris</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {JSON.parse(selectedReport.topSellingItems).slice(0, 10).map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="w-8 h-8 flex items-center justify-center rounded-full">
                                {index + 1}
                              </Badge>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-orange-600">{item.qty} pcs</p>
                              <p className="text-sm text-gray-600">{formatCurrency(item.revenue)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Category Breakdown */}
              {selectedReport.categoryBreakdown && (
                <Card>
                  <CardHeader>
                    <CardTitle>Penjualan per Kategori</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {JSON.parse(selectedReport.categoryBreakdown).map((cat: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="font-medium">{cat.name}</span>
                          <div className="text-right">
                            <p className="font-bold text-orange-600">{cat.count} pcs</p>
                            <p className="text-sm text-gray-600">{formatCurrency(cat.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Dialog */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPromo ? 'Edit Promo' : 'Tambah Promo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nama Promo</Label>
              <Input
                value={newPromo.name}
                onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
                placeholder="Nama promo"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                value={newPromo.description}
                onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                placeholder="Deskripsi promo"
                rows={3}
              />
            </div>
            <div>
              <Label>Diskon (%)</Label>
              <Input
                type="number"
                value={newPromo.discountPercent}
                onChange={(e) => setNewPromo({ ...newPromo, discountPercent: parseInt(e.target.value) || 0 })}
                placeholder="Persentase diskon"
              />
            </div>
            <div>
              <Label>Min. Belanja</Label>
              <Input
                type="number"
                value={newPromo.minPurchase}
                onChange={(e) => setNewPromo({ ...newPromo, minPurchase: parseInt(e.target.value) || 0 })}
                placeholder="Minimum pembelian"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tanggal Mulai</Label>
                <Input
                  type="date"
                  value={newPromo.startDate}
                  onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Tanggal Selesai</Label>
                <Input
                  type="date"
                  value={newPromo.endDate}
                  onChange={(e) => setNewPromo({ ...newPromo, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromoDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSavePromo}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Voucher Dialog */}
      <Dialog open={showVoucherDialog} onOpenChange={setShowVoucherDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVoucher ? 'Edit Voucher' : 'Tambah Voucher'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Kode Voucher</Label>
              <Input
                value={newVoucher.code}
                onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                placeholder="KODEVOUCHER"
                disabled={!!editingVoucher}
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                value={newVoucher.description}
                onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
                placeholder="Deskripsi voucher"
                rows={3}
              />
            </div>
            <div>
              <Label>Diskon (%)</Label>
              <Input
                type="number"
                value={newVoucher.discountPercent}
                onChange={(e) => setNewVoucher({ ...newVoucher, discountPercent: parseInt(e.target.value) || 0 })}
                placeholder="Persentase diskon"
              />
            </div>
            <div>
              <Label>Maks. Diskon</Label>
              <Input
                type="number"
                value={newVoucher.maxDiscount}
                onChange={(e) => setNewVoucher({ ...newVoucher, maxDiscount: parseInt(e.target.value) || 0 })}
                placeholder="Maksimum diskon"
              />
            </div>
            <div>
              <Label>Min. Belanja</Label>
              <Input
                type="number"
                value={newVoucher.minPurchase}
                onChange={(e) => setNewVoucher({ ...newVoucher, minPurchase: parseInt(e.target.value) || 0 })}
                placeholder="Minimum pembelian"
              />
            </div>
            <div>
              <Label>Batas Penggunaan</Label>
              <Input
                type="number"
                value={newVoucher.usageLimit}
                onChange={(e) => setNewVoucher({ ...newVoucher, usageLimit: parseInt(e.target.value) || 0 })}
                placeholder="0 untuk tidak terbatas"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tanggal Mulai</Label>
                <Input
                  type="date"
                  value={newVoucher.startDate}
                  onChange={(e) => setNewVoucher({ ...newVoucher, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Tanggal Selesai</Label>
                <Input
                  type="date"
                  value={newVoucher.endDate}
                  onChange={(e) => setNewVoucher({ ...newVoucher, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoucherDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveVoucher}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
