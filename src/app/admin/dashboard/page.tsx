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
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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

  // Products state
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0,
    categoryId: '',
    image: '🍗',
    isActive: true
  })
  const [productSearch, setProductSearch] = useState('')
  const [showInactiveProducts, setShowInactiveProducts] = useState(false)

  // Orders state
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderDetailDialog, setShowOrderDetailDialog] = useState(false)
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')

  // Members state
  const [members, setMembers] = useState<any[]>([])
  const [showMemberDialog, setShowMemberDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [newMember, setNewMember] = useState({
    points: 0,
    tier: 'regular'
  })
  const [memberSearch, setMemberSearch] = useState('')
  const [memberFilter, setMemberFilter] = useState('all')

  // Users state
  const [users, setUsers] = useState<any[]>([])
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    avatar: ''
  })
  const [userSearch, setUserSearch] = useState('')

  // Reports state
  const [reportPeriod, setReportPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today')
  const [reportData, setReportData] = useState<any>(null)
  const [loadingReport, setLoadingReport] = useState(false)

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

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch(() => console.error('Failed to fetch categories'))
  }, [])

  // Fetch products
  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products)
        }
      })
      .catch(() => console.error('Failed to fetch products'))
  }, [])

  // Fetch orders
  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders)
        }
      })
      .catch(() => console.error('Failed to fetch orders'))
  }, [])

  // Fetch members
  useEffect(() => {
    const token = getToken()
    fetch('/api/admin/members', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.members) {
          setMembers(data.members)
        }
      })
      .catch(() => console.error('Failed to fetch members'))
  }, [])

  // Fetch users
  useEffect(() => {
    const token = getToken()
    fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users)
        }
      })
      .catch(() => console.error('Failed to fetch users'))
  }, [])

  // Fetch reports data when period changes
  useEffect(() => {
    const fetchReportData = async () => {
      setLoadingReport(true)
      try {
        let url = '/api/dashboard/today'
        if (reportPeriod === 'week') url = '/api/dashboard/week'
        else if (reportPeriod === 'month') url = '/api/dashboard/month'
        else if (reportPeriod === 'year') url = '/api/admin/reports?period=yearly'

        const res = await fetch(url)
        const data = await res.json()
        setReportData(data)
      } catch (error) {
        console.error('Failed to fetch report data:', error)
      } finally {
        setLoadingReport(false)
      }
    }

    fetchReportData()
  }, [reportPeriod])

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

  // Products handlers
  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct)
        })

        if (response.ok) {
          const data = await response.json()
          setProducts(products.map((p) =>
            p.id === editingProduct.id ? { ...p, ...data.product, category: p.category } : p
          ))
          setShowProductDialog(false)
          setEditingProduct(null)
          setNewProduct({ name: '', description: '', price: '', stock: 0, categoryId: '', image: '🍗', isActive: true })
          toast({
            title: 'Berhasil',
            description: 'Produk telah diperbarui',
          })
        }
      } else {
        // Create new product
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct)
        })

        if (response.ok) {
          const data = await response.json()
          setProducts([...products, data.product])
          setShowProductDialog(false)
          setNewProduct({ name: '', description: '', price: '', stock: 0, categoryId: '', image: '🍗', isActive: true })
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

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock,
      categoryId: product.categoryId,
      image: product.image || '🍗',
      isActive: product.isActive
    })
    setShowProductDialog(true)
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(products.map((p) =>
          p.id === id ? { ...p, isActive: false } : p
        ))
        toast({
          title: 'Berhasil',
          description: 'Produk telah dinonaktifkan',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menonaktifkan produk',
        variant: 'destructive'
      })
    }
  }

  // Users handlers
  const handleSaveUser = async () => {
    try {
      const token = getToken()
      if (editingUser) {
        // Update existing user
        const response = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUser)
        })

        if (response.ok) {
          const data = await response.json()
          setUsers(users.map((u) =>
            u.id === editingUser.id ? { ...u, ...data.user } : u
          ))
          setShowUserDialog(false)
          setEditingUser(null)
          setNewUser({ name: '', email: '', phone: '', password: '', role: 'user', avatar: '' })
          toast({
            title: 'Berhasil',
            description: 'Pengguna telah diperbarui',
          })
        }
      } else {
        // Create new user
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUser)
        })

        if (response.ok) {
          const data = await response.json()
          setUsers([...users, data.user])
          setShowUserDialog(false)
          setNewUser({ name: '', email: '', phone: '', password: '', role: 'user', avatar: '' })
          toast({
            title: 'Berhasil',
            description: 'Pengguna baru telah ditambahkan',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menyimpan pengguna',
        variant: 'destructive'
      })
    }
  }

  const handleEditUser = (userData: any) => {
    setEditingUser(userData)
    setNewUser({
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      password: '',
      role: userData.role || 'user',
      avatar: userData.avatar || ''
    })
    setShowUserDialog(true)
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const token = getToken()
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== id))
        toast({
          title: 'Berhasil',
          description: 'Pengguna telah dihapus',
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus pengguna',
        variant: 'destructive'
      })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-500 hover:bg-purple-600'
      case 'cashier':
        return 'bg-blue-500 hover:bg-blue-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  // Member handlers
  const handleEditMember = (member: any) => {
    setEditingMember(member)
    setNewMember({
      points: member.points || 0,
      tier: member.tier || 'regular'
    })
    setShowMemberDialog(true)
  }

  const handleSaveMember = async () => {
    try {
      if (editingMember) {
        const token = getToken()
        const response = await fetch(`/api/admin/members/${editingMember.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMember)
        })

        if (response.ok) {
          const data = await response.json()
          setMembers(members.map((m) =>
            m.id === editingMember.id ? { ...m, ...newMember } : m
          ))
          setShowMemberDialog(false)
          setEditingMember(null)
          setNewMember({ points: 0, tier: 'regular' })
          toast({
            title: 'Berhasil',
            description: 'Data member telah diperbarui',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat memperbarui member',
        variant: 'destructive'
      })
    }
  }

  const handleAddPoints = async (memberId: string, pointsToAdd: number) => {
    try {
      const token = getToken()
      const member = members.find((m) => m.id === memberId)
      if (!member) return

      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ points: (member.points || 0) + pointsToAdd })
      })

      if (response.ok) {
        setMembers(members.map((m) =>
          m.id === memberId ? { ...m, points: (m.points || 0) + pointsToAdd } : m
        ))
        toast({
          title: 'Berhasil',
          description: `Poin berhasil ditambahkan`,
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menambah poin',
        variant: 'destructive'
      })
    }
  }

  const getTierBadgeVariant = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600'
      case 'gold':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600'
      case 'silver':
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-slate-600'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-600'
    }
  }

  const handleLogout = () => {
    logout()
  }

  // Orders handlers
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowOrderDetailDialog(true)
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(orders.map((order) =>
          order.id === orderId ? { ...order, status, ...data.order } : order
        ))
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status, ...data.order })
        }
        toast({
          title: 'Berhasil',
          description: `Status pesanan telah diubah menjadi ${status}`,
        })
      }
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mengubah status pesanan',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'default'
      case 'processed': return 'secondary'
      case 'completed': return 'default'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'processed': return 'Diproses'
      case 'completed': return 'Selesai'
      case 'cancelled': return 'Dibatalkan'
      default: return status
    }
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

          {/* Members Content */}
          {activeSection === 'members' && (
            <>
        {/* Members Section */}
        <Card>
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Kelola Member</h3>
                <p className="text-sm text-gray-500">Kelola data member, poin, dan tier membership</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Points Issued</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {members.reduce((sum, m) => sum + (m.points || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Cari berdasarkan nama, email, atau member ID..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
              </div>
              <Tabs value={memberFilter} onValueChange={setMemberFilter} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="regular">Regular</TabsTrigger>
                  <TabsTrigger value="silver">Silver</TabsTrigger>
                  <TabsTrigger value="gold">Gold</TabsTrigger>
                  <TabsTrigger value="platinum">Platinum</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members
                    .filter((m) => {
                      const searchLower = memberSearch.toLowerCase()
                      const matchesSearch =
                        m.user?.name?.toLowerCase().includes(searchLower) ||
                        m.user?.email?.toLowerCase().includes(searchLower) ||
                        m.id?.toLowerCase().includes(searchLower) ||
                        m.user?.phone?.toLowerCase().includes(searchLower)
                      const matchesFilter = memberFilter === 'all' || m.tier === memberFilter
                      return matchesSearch && matchesFilter
                    })
                    .map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {member.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{member.user?.name || '-'}</p>
                              <p className="text-xs text-gray-500">{member.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">{member.user?.email || '-'}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">{member.user?.phone || '-'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTierBadgeVariant(member.tier)}>
                            {member.tier?.charAt(0).toUpperCase() + member.tier?.slice(1) || 'Regular'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-gray-900">{member.points?.toLocaleString() || 0}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">Rp {(member.totalSpent || 0).toLocaleString()}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {member.createdAt ? new Date(member.createdAt).toLocaleDateString('id-ID') : '-'}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddPoints(member.id, 100)}
                              className="gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+100</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMember(member)}
                            >
                              <Edit2 className="w-4 h-4 text-blue-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {members.filter((m) => {
                    const searchLower = memberSearch.toLowerCase()
                    const matchesSearch =
                      m.user?.name?.toLowerCase().includes(searchLower) ||
                      m.user?.email?.toLowerCase().includes(searchLower) ||
                      m.id?.toLowerCase().includes(searchLower) ||
                      m.user?.phone?.toLowerCase().includes(searchLower)
                    const matchesFilter = memberFilter === 'all' || m.tier === memberFilter
                    return matchesSearch && matchesFilter
                  }).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Tidak ada member yang ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Member Dialog */}
        <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Member ID</Label>
                <Input
                  value={editingMember?.id || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label>Nama</Label>
                <Input
                  value={editingMember?.user?.name || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editingMember?.user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={editingMember?.user?.phone || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label>Points</Label>
                <Input
                  type="number"
                  value={newMember.points}
                  onChange={(e) => setNewMember({ ...newMember, points: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div>
                <Label>Tier</Label>
                <Select
                  value={newMember.tier}
                  onValueChange={(value) => setNewMember({ ...newMember, tier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Total Spent</Label>
                <Input
                  value={`Rp ${(editingMember?.totalSpent || 0).toLocaleString()}`}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowMemberDialog(false)
                setEditingMember(null)
                setNewMember({ points: 0, tier: 'regular' })
              }}>
                Batal
              </Button>
              <Button onClick={handleSaveMember}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
            </>
          )}

          {/* Products Content */}
          {activeSection === 'products' && (
            <>
        {/* Products Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Kelola Produk</h3>
                <p className="text-sm text-gray-500">Tambah, edit, dan kelola produk menu</p>
              </div>
              <Button
                onClick={() => {
                  setShowProductDialog(true)
                  setEditingProduct(null)
                  setNewProduct({ name: '', description: '', price: '', stock: 0, categoryId: '', image: '🍗', isActive: true })
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk</span>
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Cari berdasarkan nama produk..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showInactiveProducts}
                  onCheckedChange={setShowInactiveProducts}
                />
                <Label className="text-sm">Tampilkan produk non-aktif</Label>
              </div>
            </div>

            {/* Products Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products
                  .filter((p) => {
                    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase())
                    const matchesActive = showInactiveProducts || p.isActive
                    return matchesSearch && matchesActive
                  })
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                            {product.image}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            {product.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category?.name || '-'}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-gray-900">Rp {product.price.toLocaleString()}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-900">{product.stock}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                            disabled={!product.isActive}
                          >
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={!product.isActive}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {products.filter((p) => {
                  const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase())
                  const matchesActive = showInactiveProducts || p.isActive
                  return matchesSearch && matchesActive
                }).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Tidak ada produk yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Product Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Nama Produk *</Label>
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
                <Label>Harga *</Label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Harga produk"
                  min={0}
                />
              </div>
              <div>
                <Label>Stok</Label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div>
                <Label>Kategori *</Label>
                <Select
                  value={newProduct.categoryId}
                  onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                >
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
                <Label>Icon/Emoji (opsional)</Label>
                <Input
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="🍗"
                  maxLength={2}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newProduct.isActive}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, isActive: checked })}
                />
                <Label className="text-sm">Produk Aktif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowProductDialog(false)
                setEditingProduct(null)
                setNewProduct({ name: '', description: '', price: '', stock: 0, categoryId: '', image: '🍗', isActive: true })
              }}>
                Batal
              </Button>
              <Button onClick={handleSaveProduct}>
                {editingProduct ? 'Update' : 'Simpan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
            </>
          )}

          {/* Users Content */}
          {activeSection === 'users' && (
            <>
        {/* Users Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Kelola Pengguna</h3>
                <p className="text-sm text-gray-500">Tambah, edit, dan kelola pengguna sistem</p>
              </div>
              <Button
                onClick={() => {
                  setShowUserDialog(true)
                  setEditingUser(null)
                  setNewUser({ name: '', email: '', phone: '', password: '', role: 'user', avatar: '' })
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengguna</span>
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Cari berdasarkan nama, email, atau phone..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {/* Users Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter((u) => {
                    const searchLower = userSearch.toLowerCase()
                    return (
                      u.name?.toLowerCase().includes(searchLower) ||
                      u.email?.toLowerCase().includes(searchLower) ||
                      u.phone?.toLowerCase().includes(searchLower)
                    )
                  })
                  .map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {userData.avatar ? (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                              <span>{userData.avatar}</span>
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-orange-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{userData.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-900">{userData.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-900">{userData.phone || '-'}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(userData.role)}>
                          {userData.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">
                          {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : '-'}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(userData)}
                          >
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(userData.id)}
                            disabled={userData.id === user?.id}
                            title={userData.id === user?.id ? 'Tidak bisa menghapus diri sendiri' : 'Hapus pengguna'}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {users.filter((u) => {
                  const searchLower = userSearch.toLowerCase()
                  return (
                    u.name?.toLowerCase().includes(searchLower) ||
                    u.email?.toLowerCase().includes(searchLower) ||
                    u.phone?.toLowerCase().includes(searchLower)
                  )
                }).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Tidak ada pengguna yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit User Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Nama Lengkap *</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <Label>{editingUser ? 'Password (biarkan kosong jika tidak ingin mengubah)' : 'Password *'}</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder={editingUser ? '••••••' : 'Minimal 6 karakter'}
                />
              </div>
              <div>
                <Label>Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Avatar (emoji, opsional)</Label>
                <Input
                  value={newUser.avatar}
                  onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
                  placeholder="👤 atau biarkan kosong"
                  maxLength={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowUserDialog(false)
                setEditingUser(null)
                setNewUser({ name: '', email: '', phone: '', password: '', role: 'user', avatar: '' })
              }}>
                Batal
              </Button>
              <Button onClick={handleSaveUser}>
                {editingUser ? 'Update' : 'Simpan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
            </>
          )}

          {/* Reports Content */}
          {activeSection === 'reports' && (
            <>
        {/* Reports Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Laporan Penjualan</h3>
            <p className="text-sm text-gray-500">Analisis dan ringkasan penjualan restoran</p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              // Export to CSV
              if (reportData) {
                const dataStr = JSON.stringify(reportData, null, 2)
                const dataBlob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `laporan-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`
                link.click()
                toast({
                  title: 'Berhasil',
                  description: 'Laporan berhasil didownload',
                })
              }
            }}
          >
            <Receipt className="w-4 h-4" />
            <span>Export Laporan</span>
          </Button>
        </div>

        {/* Period Selector */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Tabs value={reportPeriod} onValueChange={(value: any) => setReportPeriod(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="today">Hari Ini</TabsTrigger>
                <TabsTrigger value="week">Minggu Ini</TabsTrigger>
                <TabsTrigger value="month">Bulan Ini</TabsTrigger>
                <TabsTrigger value="year">Tahun Ini</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {loadingReport ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reportData ? (
          <>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {(reportData.totalSales || 0).toLocaleString()}
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
                  <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.totalOrders || 0}
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
                  <p className="text-sm text-gray-600 mb-1">Rata-rata Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {(reportData.avgOrderValue || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Items Terjual</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.itemsSold || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Over Time - Line Chart */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Penjualan per Waktu</h4>
              <div className="space-y-4">
                {reportData.dailySales && reportData.dailySales.length > 0 ? (
                  <div className="space-y-3">
                    {reportData.dailySales.slice(0, 7).map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-gray-600 shrink-0">
                          {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="flex-1">
                          <div
                            className="h-8 bg-orange-500 rounded-lg flex items-end px-2 transition-all"
                            style={{
                              height: `${Math.min(100, Math.max(20, (item.sales / (Math.max(...reportData.dailySales.map((d: any) => d.sales)) || 1)) * 100))}%`
                            }}
                          >
                            <span className="text-xs text-white font-medium">
                              Rp {(item.sales / 1000).toFixed(0)}k
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Data tidak tersedia</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods - Donut Chart */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h4>
              <div className="space-y-3">
                {reportData.paymentMethods ? (
                  Object.entries(reportData.paymentMethods).map(([method, amount]: [string, any]) => {
                    const total = Object.values(reportData.paymentMethods).reduce((sum: number, val: any) => sum + val, 0)
                    const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0
                    const colors: any = {
                      cash: 'bg-green-500',
                      qris: 'bg-blue-500',
                      transfer: 'bg-orange-500',
                    }
                    const labels: any = {
                      cash: 'Cash',
                      qris: 'QRIS',
                      transfer: 'Transfer',
                    }

                    if (amount === 0) return null

                    return (
                      <div key={method} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-700">{labels[method] || method}</span>
                            <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors[method] || 'bg-gray-500'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Rp {amount.toLocaleString()}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Data tidak tersedia</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Pesanan</h4>
            {reportData.transactions && reportData.transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.transactions.slice(0, 10).map((order: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>#{order.id?.slice(-6) || '-'}</TableCell>
                      <TableCell className="font-medium">Rp {order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status === 'completed' ? 'Selesai' : order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : reportData.reports ? (
              <div className="space-y-2">
                {reportData.reports.slice(0, 10).map((report: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{report.date}</p>
                      <p className="text-sm text-gray-500">{report.orders} pesanan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">Rp {report.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{report.itemsSold} items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Data tidak tersedia</p>
            )}
          </CardContent>
        </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Data</h4>
                <p className="text-sm text-gray-500">
                  Belum ada data penjualan untuk periode ini
                </p>
              </div>
            </CardContent>
          </Card>
        )}
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

          {/* Orders Content */}
          {activeSection === 'orders' && (
            <>
        {/* Orders Section */}
        <Card>
          <CardContent className="p-6">
            {/* Header with Stats */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Kelola Pesanan</h3>
                  <p className="text-sm text-gray-500">Lihat dan kelola semua pesanan masuk</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Pesanan</p>
                        <p className="text-xl font-bold text-gray-900">{orders.length}</p>
                      </div>
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                        <p className="text-xl font-bold text-gray-900">
                          Rp {orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Avg Order Value</p>
                        <p className="text-xl font-bold text-gray-900">
                          Rp {orders.length > 0 ? Math.round(orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length).toLocaleString() : 0}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Filter Tabs */}
              <Tabs value={orderStatusFilter} onValueChange={setOrderStatusFilter} className="mb-6">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processed">Diproses</TabsTrigger>
                  <TabsTrigger value="completed">Selesai</TabsTrigger>
                  <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items Count</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders
                    .filter((order) => {
                      if (orderStatusFilter === 'all') return true
                      return order.status === orderStatusFilter
                    })
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <p className="font-semibold text-gray-900">#{order.orderNumber || order.id.substring(0, 8)}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{order.user?.email || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-900">{order.items?.length || 0} item(s)</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-gray-900">Rp {(order.total || 0).toLocaleString()}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.paymentMethod || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                            {getStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              View
                            </Button>
                            {order.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order.id, 'processed')}
                                className="text-green-600 hover:text-green-700"
                              >
                                Process
                              </Button>
                            )}
                            {order.status === 'processed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                className="text-green-600 hover:text-green-700"
                              >
                                Complete
                              </Button>
                            )}
                            {(order.status === 'pending' || order.status === 'processed') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                className="text-red-600 hover:text-red-700"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {orders.filter((order) => {
                    if (orderStatusFilter === 'all') return true
                    return order.status === orderStatusFilter
                  }).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Tidak ada pesanan yang ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={showOrderDetailDialog} onOpenChange={setShowOrderDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pesanan #{selectedOrder?.orderNumber || selectedOrder?.id?.substring(0, 8)}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6 py-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Tanggal Pesanan</Label>
                    <p className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Status</Label>
                    <div>
                      <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="capitalize">
                        {getStatusLabel(selectedOrder.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Informasi Pelanggan</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nama:</span>
                        <span className="font-medium">{selectedOrder.user?.name || 'Guest'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedOrder.user?.email || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedOrder.user?.phone || '-'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Item Pesanan</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produk</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Harga</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.product?.name || item.name || 'Product'}</p>
                                {item.product?.description && (
                                  <p className="text-xs text-gray-500 line-clamp-1">{item.product.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              Rp {(item.price || item.product?.price || 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              Rp {((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Ringkasan Pesanan</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">Rp {(selectedOrder.subtotal || selectedOrder.total || 0).toLocaleString()}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diskon:</span>
                          <span className="font-medium text-red-600">-Rp {selectedOrder.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-orange-600">Rp {(selectedOrder.total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Info */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Informasi Pembayaran</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode:</span>
                        <span className="font-medium capitalize">{selectedOrder.paymentMethod || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status Pembayaran:</span>
                        <span className="font-medium">
                          <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'default' : 'secondary'} className="capitalize">
                            {selectedOrder.paymentStatus || 'Pending'}
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Update Status Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Diproses
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                      >
                        Batalkan
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === 'processed' && (
                    <>
                      <Button
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'completed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Selesai
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                      >
                        Batalkan
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOrderDetailDialog(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
            </>
          )}

          {/* Placeholder for other sections */}
          {activeSection !== 'dashboard' && activeSection !== 'products' && activeSection !== 'settings' && activeSection !== 'members' && activeSection !== 'orders' && (
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
