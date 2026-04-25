'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import {
  Utensils,
  ShoppingCart,
  User,
  Search,
  Phone,
  Mail,
  Lock,
  LogOut,
  CreditCard,
  QrCode,
  CheckCircle,
  XCircle,
  Star,
  Package,
  Bell,
  Menu,
  X,
  ChevronRight,
  Minus,
  Plus,
  Wallet,
  Scan,
  Receipt,
  Printer,
  MoreVertical,
  Home,
  Settings,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  Flame,
  ClockIcon,
  Gift,
  Heart,
  MapPin,
  Edit3,
  Share2,
  Trophy,
  Award,
  Crown,
  ChevronDown,
  WalletCards,
  History,
  Tag,
  Map,
  BellRing,
  Globe,
  Eye,
  EyeOff,
  Copy,
  FileText,
  Info,
  Download,
  Trash2
} from 'lucide-react'

type ScreenType = 'splash' | 'login' | 'register' | 'home' | 'menu' | 'cart' | 'checkout' | 'orderStatus' | 'account' | 'pos' | 'shift'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
  category: string
}

interface CartItem {
  product: Product
  qty: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  items: CartItem[]
  createdAt: Date
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ayam Geprek Original',
    description: 'Ayam goreng crispy dengan sambal ijo pedas',
    price: 25000,
    stock: 50,
    image: '🍗',
    category: 'Main'
  },
  {
    id: '2',
    name: 'Ayam Geprek Keju',
    description: 'Ayam goreng crispy dengan sambal ijo dan keju',
    price: 30000,
    stock: 35,
    image: '🍗',
    category: 'Main'
  },
  {
    id: '3',
    name: 'Ayam Geprek Telur',
    description: 'Ayam goreng crispy dengan sambal ijo dan telur',
    price: 28000,
    stock: 40,
    image: '🍗',
    category: 'Main'
  },
  {
    id: '4',
    name: 'Nasi Geprek',
    description: 'Nasi dengan ayam geprek sambal ijo',
    price: 22000,
    stock: 45,
    image: '🍚',
    category: 'Main'
  },
  {
    id: '5',
    name: 'Es Teh Manis',
    description: 'Teh manis dingin segar',
    price: 8000,
    stock: 100,
    image: '🧊',
    category: 'Drink'
  },
  {
    id: '6',
    name: 'Es Jeruk',
    description: 'Jeruk peras dingin segar',
    price: 10000,
    stock: 80,
    image: '🍊',
    category: 'Drink'
  },
  {
    id: '7',
    name: 'Kopi Susu',
    description: 'Kopi susu gula aren',
    price: 15000,
    stock: 60,
    image: '☕',
    category: 'Drink'
  },
  {
    id: '8',
    name: 'Pisang Goreng',
    description: 'Pisang goreng crispy dengan gula pasir',
    price: 12000,
    stock: 70,
    image: '🍌',
    category: 'Snack'
  },
  {
    id: '9',
    name: 'Tahu Crispy',
    description: 'Tahu goreng crispy dengan bumbu',
    price: 10000,
    stock: 65,
    image: '🥢',
    category: 'Snack'
  },
  {
    id: '10',
    name: 'Tempe Mendoan',
    description: 'Tempe mendoan pedas',
    price: 10000,
    stock: 55,
    image: '🥢',
    category: 'Snack'
  }
]

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD001',
    status: 'completed',
    total: 53000,
    items: [{ product: mockProducts[0], qty: 2 }, { product: mockProducts[4], qty: 1 }],
    createdAt: new Date()
  },
  {
    id: '2',
    orderNumber: 'ORD002',
    status: 'processing',
    total: 38000,
    items: [{ product: mockProducts[1], qty: 1 }, { product: mockProducts[5], qty: 1 }],
    createdAt: new Date()
  }
]

// Helper function to get member tier
const getMemberTier = (points: number) => {
  if (points >= 500000) return 'Platinum'
  if (points >= 200000) return 'Gold'
  if (points >= 50000) return 'Silver'
  return 'Regular'
}

// Helper function to get card gradient based on tier
const getCardGradient = (tier: string) => {
  switch (tier) {
    case 'Platinum':
      return 'bg-gradient-to-br from-purple-600 via-violet-500 to-fuchsia-500'
    case 'Gold':
      return 'bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-400'
    case 'Silver':
      return 'bg-gradient-to-br from-slate-400 via-gray-400 to-zinc-400'
    default:
      return 'bg-gradient-to-br from-gray-600 via-gray-500 to-slate-500'
  }
}

// Helper function to get member ID with 6 random digits
const getMemberId = () => {
  // Generate 6 random digits
  const digits = Math.floor(100000 + Math.random() * 900000)
  return String(digits)
}

// Helper function to format time ago
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  return `${diffDays} hari yang lalu`
}

// Helper function to get payment method display name
const getPaymentMethodDisplayName = (method: string): string => {
  const methods: Record<string, string> = {
    cash: '💵 CASH',
    qris: '📱 QRIS',
    transfer: '🏦 TRANSFER',
  }
  return methods[method] || method.toUpperCase()
}

// Helper function to get order status display
const getOrderStatusDisplay = (status: string): string => {
  const statuses: Record<string, string> = {
    pending: 'Menunggu',
    paid: 'Lunas',
    processing: 'Diproses',
    completed: 'Selesai',
    cancelled: 'Batal',
  }
  return statuses[status] || status
}

// Helper function to get status badge color
const getStatusBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

// Header Component with Notification and Chat
interface HeaderProps {
  notificationCount?: number
  unreadChatCount?: number
  onNotificationClick?: () => void
  onChatClick?: () => void
  memberName?: string
  memberAvatar?: string | null
}

function Header({
  notificationCount = 0,
  unreadChatCount = 0,
  onNotificationClick,
  onChatClick,
  memberName,
  memberAvatar
}: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 pt-8 rounded-b-3xl shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">
            {memberName || 'Guest'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="text-white hover:bg-white/20 relative"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs h-5 w-5 flex items-center justify-center p-0">
                {notificationCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onChatClick}
            className="text-white hover:bg-white/20 relative"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs h-5 w-5 flex items-center justify-center p-0">
                {unreadChatCount}
              </Badge>
            )}
          </Button>
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-md">
            {memberAvatar ? (
              <img
                src={memberAvatar}
                alt={memberName || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg">👤</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RestaurantApp() {
  const [screen, setScreen] = useState<ScreenType>('splash')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [memberData, setMemberData] = useState<any>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [points, setPoints] = useState(150)
  const [memberCardTab, setMemberCardTab] = useState<'card' | 'barcode'>('card')
  const [productTab, setProductTab] = useState<'populer' | 'terlaris' | 'terbaru'>('populer')
  const [accountTab, setAccountTab] = useState<'profile' | 'orders' | 'vouchers' | 'favorites'>('profile')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showVoucherDetail, setShowVoucherDetail] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [vouchers, setVouchers] = useState<any[]>([
    { id: '1', code: 'AYAMHEMAT', discount: '20%', minOrder: 50000, expiry: '2024-12-31', type: 'percentage', isUsed: false },
    { id: '2', code: 'FREEDELIVERY', discount: 'Gratis Ongkir', minOrder: 30000, expiry: '2024-12-25', type: 'delivery', isUsed: false },
    { id: '3', code: 'MEMBERVIP', discount: '15%', minOrder: 100000, expiry: '2024-12-20', type: 'percentage', isUsed: true }
  ])
  const [addresses, setAddresses] = useState([
    { id: '1', label: 'Rumah', address: 'Jl. Merdeka No. 123, Jakarta Pusat', isDefault: true },
    { id: '2', label: 'Kantor', address: 'Jl. Sudirman No. 456, Jakarta Selatan', isDefault: false }
  ])
  const [stats, setStats] = useState({
    totalOrders: 12,
    totalSpent: 1250000,
    pointsEarned: 12500,
    totalSaved: 85000
  })
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editAvatar, setEditAvatar] = useState<string | null>(null)

  // Dialog states for new features
  const [showExchangePoints, setShowExchangePoints] = useState(false)
  const [showSecurityPrivacy, setShowSecurityPrivacy] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [showLanguageSettings, setShowLanguageSettings] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)
  const [showHelpCenter, setShowHelpCenter] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('id')
  const [selectedReward, setSelectedReward] = useState<string | null>(null)
  const [showVoucherSuccess, setShowVoucherSuccess] = useState(false)
  const [generatedVoucher, setGeneratedVoucher] = useState<any>(null)
  const [isExchanging, setIsExchanging] = useState(false)
  const [voucherCode, setVoucherCode] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null)
  const [isVoucherValid, setIsVoucherValid] = useState<boolean | null>(null)
  const [voucherError, setVoucherError] = useState('')
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false)

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    newsletters: false
  })

  // Security & Privacy settings state
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [privacySettings, setPrivacySettings] = useState({
    privateProfile: false,
    locationAccess: true
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Featured products from database
  const [populerProducts, setPopulerProducts] = useState<Product[]>([])
  const [terlarisProducts, setTerlarisProducts] = useState<Product[]>([])
  const [terbaruProducts, setTerbaruProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // All products and categories from database
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loadingAllProducts, setLoadingAllProducts] = useState(true)

  const [memberId, setMemberId] = useState(() => {
    // Generate member ID on initial load
    const digits = Math.floor(100000 + Math.random() * 900000)
    return String(digits)
  })

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register form state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')

  // POS state
  const [posCart, setPosCart] = useState<CartItem[]>([])
  const [isShiftOpen, setIsShiftOpen] = useState(false)
  const [shiftAmount, setShiftAmount] = useState(0)

  // Payment methods and redeem products state
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [redeemProducts, setRedeemProducts] = useState<any[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false)
  const [loadingRedeemProducts, setLoadingRedeemProducts] = useState(false)

  // Receipt preview state
  const [showReceiptPreviewDialog, setShowReceiptPreviewDialog] = useState(false)
  const [previewOrderData, setPreviewOrderData] = useState<any>(null)

  // Notification & Chat state
  const [showNotifications, setShowNotifications] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [unreadChatCount, setUnreadChatCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        setScreen('home')
      } else {
        setScreen('login')
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [isLoggedIn])

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true)
        const [populer, terlaris, terbaru] = await Promise.all([
          fetch('/api/products/featured?type=populer&limit=4'),
          fetch('/api/products/featured?type=terlaris&limit=4'),
          fetch('/api/products/featured?type=terbaru&limit=4')
        ])

        const [populerData, terlarisData, terbaruData] = await Promise.all([
          populer.json(),
          terlaris.json(),
          terbaru.json()
        ])

        if (populerData.products) setPopulerProducts(populerData.products)
        if (terlarisData.products) setTerlarisProducts(terlarisData.products)
        if (terbaruData.products) setTerbaruProducts(terbaruData.products)
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
        // Fallback to mock data if API fails
        setPopulerProducts(mockProducts.slice(0, 4))
        setTerlarisProducts([...mockProducts].sort((a, b) => a.stock - b.stock).slice(0, 4))
        setTerbaruProducts(mockProducts.slice(-4))
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Fetch payment methods from database
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoadingPaymentMethods(true)
        const response = await fetch('/api/payment-methods')
        const data = await response.json()

        if (data.paymentMethods) {
          setPaymentMethods(data.paymentMethods)
          // Select first payment method as default
          if (data.paymentMethods.length > 0) {
            setSelectedPaymentMethod(data.paymentMethods[0].name)
          }
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error)
      } finally {
        setLoadingPaymentMethods(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  // Fetch redeem products from database
  useEffect(() => {
    const fetchRedeemProducts = async () => {
      try {
        setLoadingRedeemProducts(true)
        const response = await fetch('/api/redeem-products')
        const data = await response.json()

        if (data.redeemProducts) {
          setRedeemProducts(data.redeemProducts)
        }
      } catch (error) {
        console.error('Failed to fetch redeem products:', error)
      } finally {
        setLoadingRedeemProducts(false)
      }
    }

    fetchRedeemProducts()
  }, [])

  // Fetch all products from database
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoadingAllProducts(true)
        const response = await fetch('/api/products')
        const data = await response.json()

        if (data.products) {
          // Format products to match Product interface
          const formattedProducts = data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            price: p.price,
            stock: p.stock,
            image: p.image || '🍗',
            category: p.category?.name || 'Other'
          }))
          setAllProducts(formattedProducts)
        }
      } catch (error) {
        console.error('Failed to fetch all products:', error)
      } finally {
        setLoadingAllProducts(false)
      }
    }

    fetchAllProducts()
  }, [])

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()

        if (data.categories) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleLogin = async () => {
    if (email && password) {
      try {
        // Call login API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast({
            title: 'Login Gagal',
            description: data.error || 'Email atau password salah',
            variant: 'destructive'
          })
          return
        }

        // Save token to localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token)
        }

        // Set user data
        setIsLoggedIn(true)
        setUser(data.user)

        // Handle role-based routing
        if (data.user.role === 'admin') {
          // Redirect to admin panel
          window.location.href = '/admin/dashboard'
          return
        } else if (data.user.role === 'cashier') {
          // Go to POS screen
          setScreen('pos')
        } else {
          // Regular user - go to home screen
          setScreen('home')
        }

        // Fetch member data
        if (data.user.id) {
          try {
            const memberResponse = await fetch(`/api/member/me?userId=${data.user.id}`)
            const memberData = await memberResponse.json()

            if (memberResponse.ok && memberData.member) {
              setMemberData(memberData.member)
              setPoints(memberData.member.points || 0)
              // Generate member ID from database member
              const digits = memberData.member.memberId || Math.floor(100000 + Math.random() * 900000)
              setMemberId(String(digits))
            }
          } catch (error) {
            console.error('Failed to fetch member data:', error)
          }

          // Fetch notifications and chat
          fetchNotifications(data.user.id)
          fetchChatMessages(data.user.id)
          fetchFavorites(data.user.id)
          fetchOrders(data.user.id)
        }

        toast({
          title: 'Login Berhasil',
          description: data.user.role === 'admin' ? 'Selamat datang, Admin!' :
                        data.user.role === 'cashier' ? 'Selamat datang, Kasir!' :
                        'Selamat datang kembali!',
        })
      } catch (error) {
        console.error('Login error:', error)
        toast({
          title: 'Login Gagal',
          description: 'Terjadi kesalahan koneksi',
          variant: 'destructive'
        })
      }
    } else {
      toast({
        title: 'Login Gagal',
        description: 'Mohon isi semua field',
        variant: 'destructive'
      })
    }
  }

  const handleRegister = () => {
    if (regName && regEmail && regPhone && regPassword) {
      toast({
        title: 'Registrasi Berhasil',
        description: 'Silakan login dengan akun baru Anda',
      })
      setScreen('login')
    } else {
      toast({
        title: 'Registrasi Gagal',
        description: 'Mohon isi semua field',
        variant: 'destructive'
      })
    }
  }

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem('auth_token')
    setIsLoggedIn(false)
    setUser(null)
    setMemberData(null)
    setCart([])
    setScreen('login')
    setShowLogoutDialog(false)
    toast({
      title: 'Logout Berhasil',
      description: 'Sampai jumpa lagi!',
    })
  }

  const handleEditProfile = async () => {
    if (!user?.id) {
      toast({
        title: 'Gagal',
        description: 'User tidak ditemukan',
        variant: 'destructive'
      })
      return
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: editName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          avatar: editAvatar
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Gagal Mengupdate Profil',
          description: data.error || 'Terjadi kesalahan',
          variant: 'destructive'
        })
        return
      }

      // Update local user state
      setUser({
        ...user,
        name: editName,
        email: editEmail,
        phone: editPhone,
        address: editAddress,
        avatar: editAvatar
      })

      // Update memberData state
      if (memberData) {
        setMemberData({
          ...memberData,
          user: {
            ...memberData.user,
            name: editName,
            email: editEmail,
            phone: editPhone,
            address: editAddress,
            avatar: editAvatar
          }
        })
      }

      toast({
        title: 'Profil Berhasil Diupdate',
        description: 'Informasi profil Anda telah diperbarui'
      })
      setShowEditProfile(false)
    } catch (error) {
      console.error('Profile update error:', error)
      toast({
        title: 'Gagal Mengupdate Profil',
        description: 'Terjadi kesalahan koneksi',
        variant: 'destructive'
      })
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Gagal',
        description: 'Mohon isi semua field password',
        variant: 'destructive'
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Gagal',
        description: 'Password baru dan konfirmasi tidak cocok',
        variant: 'destructive'
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Gagal',
        description: 'Password minimal 6 karakter',
        variant: 'destructive'
      })
      return
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword,
          newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Gagal Mengubah Password',
          description: data.error || 'Password saat ini salah',
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Password Berhasil Diubah',
        description: 'Password Anda telah diperbarui'
      })
      setShowChangePassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Password change error:', error)
      toast({
        title: 'Gagal Mengubah Password',
        description: 'Terjadi kesalahan koneksi',
        variant: 'destructive'
      })
    }
  }

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    if (!twoFactorEnabled) {
      toast({
        title: '2FA Diaktifkan',
        description: 'Two-factor authentication telah diaktifkan'
      })
    } else {
      toast({
        title: '2FA Dinonaktifkan',
        description: 'Two-factor authentication telah dinonaktifkan'
      })
    }
  }

  const handlePrivacyChange = (key: keyof typeof privacySettings, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
    toast({
      title: 'Pengaturan Privasi Diupdate',
      description: `Pengaturan ${key === 'privateProfile' ? 'profil privat' : 'lokasi'} telah diperbarui`
    })
  }

  const handleDownloadData = () => {
    const userData = {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      points: points,
      tier: memberData?.tier || getMemberTier(points),
      memberSince: memberData?.createdAt || new Date().toISOString()
    }

    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `data-pengguna-${user?.id || 'user'}.json`
    link.click()

    URL.revokeObjectURL(url)

    toast({
      title: 'Data Berhasil Diunduh',
      description: 'Data pribadi Anda telah diunduh'
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: 'Hapus Akun',
      description: 'Untuk menghapus akun, silakan hubungi customer service melalui fitur chat',
      variant: 'destructive'
    })
    setShowSecurityPrivacy(false)
    setShowChat(true)
  }

  // Fetch notifications from database
  const fetchNotifications = async (userId: string) => {
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setNotifications(data.notifications || [])
        setNotificationCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  // Fetch chat messages from database
  const fetchChatMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/chat?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setChatMessages(data.messages || [])
        // Calculate unread chat count (messages from admin that are not read)
        const unreadCount = data.messages?.filter((msg: any) => !msg.isRead && msg.senderRole === 'admin').length || 0
        setUnreadChatCount(unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch chat messages:', error)
    }
  }

  // Fetch favorites from database
  const fetchFavorites = async (userId: string) => {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        const favoriteIds = data.favorites?.map((fav: any) => fav.productId) || []
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    }
  }

  // Fetch orders from database
  const fetchOrders = async (userId: string) => {
    try {
      const response = await fetch(`/api/orders/user?userId=${userId}`)
      const data = await response.json()
      if (response.ok && data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  // Add product to favorites
  const addToFavorites = async (productId: string) => {
    if (!user?.id) {
      toast({
        title: 'Login Diperlukan',
        description: 'Silakan login untuk menambahkan ke favorit',
        variant: 'destructive'
      })
      return
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId
        })
      })

      if (response.ok) {
        setFavorites(prev => [...prev, productId])
        toast({
          title: 'Ditambahkan ke Favorit',
          description: 'Produk berhasil ditambahkan ke favorit',
        })
      } else {
        const data = await response.json()
        toast({
          title: 'Gagal',
          description: data.error || 'Terjadi kesalahan',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan koneksi',
        variant: 'destructive'
      })
    }
  }

  // Remove product from favorites
  const removeFromFavorites = async (productId: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/favorites?userId=${user.id}`)
      const data = await response.json()
      const favorite = data.favorites?.find((fav: any) => fav.productId === productId)

      if (favorite) {
        const deleteResponse = await fetch(`/api/favorites/${favorite.id}`, {
          method: 'DELETE'
        })

        if (deleteResponse.ok) {
          setFavorites(prev => prev.filter(id => id !== productId))
          toast({
            title: 'Dihapus dari Favorit',
            description: 'Produk berhasil dihapus dari favorit',
          })
        }
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan koneksi',
        variant: 'destructive'
      })
    }
  }

  // Toggle favorite
  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      removeFromFavorites(productId)
    } else {
      addToFavorites(productId)
    }
  }

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim() || !user?.id) return

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          senderRole: 'user',
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
      toast({
        title: 'Gagal mengirim pesan',
        description: 'Terjadi kesalahan, silakan coba lagi',
        variant: 'destructive'
      })
    }
  }

  // Mark all notifications as read
  const markNotificationsAsRead = async () => {
    if (!user?.id) return

    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })
      setNotificationCount(0)
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  // Mark all chat messages as read
  const markChatAsRead = async () => {
    if (!user?.id) return

    try {
      await fetch('/api/chat/read-all', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })
      setUnreadChatCount(0)
    } catch (error) {
      console.error('Failed to mark chat as read:', error)
    }
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { product, qty: 1 }]
    })
    toast({
      title: 'Ditambahkan ke Keranjang',
      description: `${product.name} telah ditambahkan`,
    })
  }

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item =>
          item.product.id === productId
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter(item => item.qty > 0)
    })
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  }

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const menuCategories = ['all', ...(categories.map(c => c.name))]

  // ========== SPLASH SCREEN ==========
  if (screen === 'splash') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400">
        <div className="text-center animate-in fade-in duration-1000">
          <div className="text-8xl mb-4">🍗</div>
          <h1 className="text-4xl font-bold text-white mb-2">Ayam Geprek</h1>
          <p className="text-xl text-white/90">Sambal Ijo</p>
        </div>
      </div>
    )
  }

  // ========== LOGIN SCREEN ==========
  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🍗</div>
              <h1 className="text-3xl font-bold mb-2">Selamat Datang</h1>
              <p className="text-muted-foreground">Login untuk memesan makanan</p>
            </div>

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
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleLogin} className="w-full bg-orange-500 hover:bg-orange-600">
              Masuk
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <button
                  onClick={() => setScreen('register')}
                  className="text-orange-500 hover:underline font-medium"
                >
                  Daftar
                </button>
              </p>
            </div>

            <Separator />

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setScreen('pos')}
              >
                <Utensils className="mr-2 h-5 w-5" />
                POS Kasir
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/admin/login'}
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Admin Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ========== REGISTER SCREEN ==========
  if (screen === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🍗</div>
              <h1 className="text-3xl font-bold mb-2">Buat Akun</h1>
              <p className="text-muted-foreground">Daftar untuk mulai memesan</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="08123456789"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="pl-10"
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
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleRegister} className="w-full bg-orange-500 hover:bg-orange-600">
              Daftar
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <button
                  onClick={() => setScreen('login')}
                  className="text-orange-500 hover:underline font-medium"
                >
                  Masuk
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ========== HOME SCREEN ==========
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header with Notification and Chat */}
        <Header
          memberName={memberData?.user?.name || user?.name || 'Guest'}
          memberAvatar={memberData?.user?.avatar || user?.avatar || null}
          notificationCount={notificationCount}
          onNotificationClick={() => setShowNotifications(true)}
          onChatClick={() => setShowChat(true)}
        />

        {/* Greeting Section */}
        <div className="px-4 py-2">
          {/* Member Card with Tabs */}
          <Tabs defaultValue="card" value={memberCardTab} onValueChange={(v) => setMemberCardTab(v as 'card' | 'barcode')} className="w-full">
            <div className={`${getCardGradient(getMemberTier(points))} rounded-t-2xl px-4 pt-4 pb-2`}>
              <TabsList className="bg-white/20 backdrop-blur-sm border-none h-9 p-1">
                <TabsTrigger value="card" className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/80 text-xs px-4 rounded-lg">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Kartu
                </TabsTrigger>
                <TabsTrigger value="barcode" className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/80 text-xs px-4 rounded-lg">
                  <QrCode className="w-4 h-4 mr-1" />
                  Barcode
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Card Tab */}
            <TabsContent value="card" className="mt-0">
              <div className={`${getCardGradient(getMemberTier(points))} rounded-b-2xl p-4 shadow-lg text-white`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Member Card</p>
                    <h3 className="font-bold text-xl">{memberData?.user?.phone || user?.phone || '081234567890'}</h3>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="font-semibold text-sm">
                      {memberData?.tier || getMemberTier(points)}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Poin Rewards</p>
                    <h3 className="font-bold text-xl">{points.toLocaleString()}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs mb-1">ID Member</p>
                    <p className="font-mono text-2xl font-bold tracking-wider">
                      {memberId}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Barcode Tab */}
            <TabsContent value="barcode" className="mt-0">
              <div className={`${getCardGradient(getMemberTier(points))} rounded-b-2xl p-6 shadow-lg text-white`}>
                <div className="text-center mb-4">
                  <p className="text-white/80 text-xs uppercase tracking-wider mb-3">Barcode Member</p>

                  {/* Simulated Barcode */}
                  <div className="bg-white rounded-lg p-4 mb-4 mx-auto max-w-xs">
                    <div className="flex items-end justify-center gap-0.5 h-16">
                      {[...Array(40)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-black"
                          style={{
                            width: Math.random() > 0.5 ? '3px' : '1px',
                            height: `${40 + Math.random() * 40}%`
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-black text-xs font-mono mt-2">{memberData?.user?.phone || user?.phone || '081234567890'}</p>
                  </div>
                </div>

                {/* Member Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Poin Rewards</p>
                      <p className="font-mono font-semibold">{points.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Tier</p>
                      <p className="font-semibold">{memberData?.tier || getMemberTier(points)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-center">
                  <div className="text-right">
                    <p className="text-white/60 text-xs mb-1">ID Member</p>
                    <p className="font-mono text-2xl font-bold tracking-wider">
                      {memberId}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Product Tabs Section */}
          <div className="p-4">
            <Tabs defaultValue="populer" value={productTab} onValueChange={(v) => setProductTab(v as 'populer' | 'terlaris' | 'terbaru')}>
              <TabsList className="grid w-full grid-cols-3 h-10 bg-gray-100">
                <TabsTrigger value="populer" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <Flame className="w-4 h-4 mr-1" />
                  Populer
                </TabsTrigger>
                <TabsTrigger value="terlaris" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Terlaris
                </TabsTrigger>
                <TabsTrigger value="terbaru" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  Terbaru
                </TabsTrigger>
              </TabsList>

              {/* Populer Products */}
              <TabsContent value="populer" className="mt-4">
                {loadingProducts ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : populerProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tidak ada produk populer</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {populerProducts.map(product => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(product.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                        <div className="bg-orange-50 h-28 flex items-center justify-center text-5xl cursor-pointer" onClick={() => { setSelectedProduct(product); addToCart(product); }}>
                          {product.image?.startsWith('data:') ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{product.image || '🍗'}</span>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-orange-600 text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                            <Badge className="bg-orange-100 text-orange-600 text-xs">Populer</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Terlaris Products */}
              <TabsContent value="terlaris" className="mt-4">
                {loadingProducts ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : terlarisProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tidak ada produk terlaris</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {terlarisProducts.map(product => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(product.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                        <div className="bg-orange-50 h-28 flex items-center justify-center text-5xl cursor-pointer" onClick={() => { setSelectedProduct(product); addToCart(product); }}>
                          {product.image?.startsWith('data:') ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{product.image || '🍗'}</span>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-orange-600 text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                            <Badge className="bg-green-100 text-green-600 text-xs">Terlaris</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Terbaru Products */}
              <TabsContent value="terbaru" className="mt-4">
                {loadingProducts ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : terbaruProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tidak ada produk terbaru</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {terbaruProducts.map(product => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(product.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                        <div className="bg-orange-50 h-28 flex items-center justify-center text-5xl cursor-pointer" onClick={() => { setSelectedProduct(product); addToCart(product); }}>
                          {product.image?.startsWith('data:') ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{product.image || '🍗'}</span>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-orange-600 text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                            <Badge className="bg-blue-100 text-blue-600 text-xs">Baru</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
          <div className="flex justify-around">
            <button
              onClick={() => setScreen('home')}
              className="flex flex-col items-center text-orange-500"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setScreen('menu')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <Package className="w-6 h-6" />
              <span className="text-xs mt-1">Menu</span>
            </button>
            <button
              onClick={() => setScreen('cart')}
              className="flex flex-col items-center text-muted-foreground relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs h-5 w-5 flex items-center justify-center p-0">
                  {cart.reduce((sum, item) => sum + item.qty, 0)}
                </Badge>
              )}
              <span className="text-xs mt-1">Keranjang</span>
            </button>
            <button
              onClick={() => setScreen('account')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Akun</span>
            </button>
          </div>
        </div>

        {/* Notification Dialog */}
        <Dialog open={showNotifications} onOpenChange={(open) => {
          setShowNotifications(open)
          if (open) markNotificationsAsRead()
        }}>
          <DialogContent className="max-w-md">
            <DialogTitle className="sr-only">Notifikasi</DialogTitle>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold">Notifikasi</h2>
            </div>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.type === 'order' ? CheckCircle :
                                  notif.type === 'promo' ? Star :
                                  notif.type === 'success' ? Gift : Bell
                    const iconColor = notif.type === 'order' ? 'text-green-600' :
                                     notif.type === 'promo' ? 'text-orange-600' :
                                     notif.type === 'success' ? 'text-orange-600' : 'text-gray-600'
                    const bgClass = notif.type === 'order' ? 'bg-green-100' :
                                     notif.type === 'promo' ? 'bg-orange-100' :
                                     notif.type === 'success' ? 'bg-orange-100' : 'bg-gray-100'
                    const timeAgo = formatTimeAgo(notif.createdAt)

                    return (
                      <Card key={notif.id} className={notif.isRead ? 'opacity-60' : ''}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog open={showChat} onOpenChange={(open) => {
          setShowChat(open)
          if (open) markChatAsRead()
        }}>
          <DialogContent className="max-w-sm h-[500px] flex flex-col p-0">
            <DialogTitle className="sr-only">Customer Service</DialogTitle>
            <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-orange-400">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Customer Service</h2>
              </div>
              <p className="text-white/80 text-sm mt-1">Online • Biasanya membalas dalam 5 menit</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada percakapan</p>
                    <p className="text-sm mt-2">Mulai dengan mengirim pesan</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isAdmin = msg.senderRole === 'admin'
                    const time = new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAdmin ? '' : 'justify-end'}`}>
                        {isAdmin ? (
                          <>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👨‍💼</span>
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{time}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-white/80 mt-1">{time}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👤</span>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Tulis pesan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
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
                  <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    )
}

  // ========== MENU SCREEN ==========
  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <Header
          memberName={memberData?.user?.name || user?.name || 'Guest'}
          memberAvatar={memberData?.user?.avatar || user?.avatar || null}
          notificationCount={notificationCount}
          onNotificationClick={() => setShowNotifications(true)}
          onChatClick={() => setShowChat(true)}
        />

        {/* Search Bar */}
        <div className="px-4 -mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {menuCategories.map(cat => (
              <Button
                key={typeof cat === 'string' ? cat : cat.id}
                variant={selectedCategory === (typeof cat === 'string' ? cat : cat.name) ? "default" : "outline"}
                onClick={() => setSelectedCategory(typeof cat === 'string' ? cat : cat.name)}
                className={selectedCategory === (typeof cat === 'string' ? cat : cat.name) ? "bg-orange-500 hover:bg-orange-600" : "whitespace-nowrap"}
              >
                {typeof cat === 'string' ? (cat === 'all' ? 'Semua' : cat) : cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </Button>
                <div className="bg-orange-50 h-32 flex items-center justify-center text-6xl overflow-hidden">
                  {product.image?.startsWith('data:') ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{product.image || '🍗'}</span>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-600 text-sm">
                      Rp {product.price.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      className="bg-orange-500 hover:bg-orange-600 h-7 w-7 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <div className="fixed bottom-20 left-4 right-4">
            <Button
              onClick={() => setScreen('cart')}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-lg"
            >
              <ShoppingCart className="w-6 h-6 mr-2" />
              Keranjang ({cart.reduce((sum, item) => sum + item.qty, 0)})
              <span className="ml-auto">Rp {getCartTotal().toLocaleString()}</span>
            </Button>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
          <div className="flex justify-around">
            <button
              onClick={() => setScreen('home')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setScreen('menu')}
              className="flex flex-col items-center text-orange-500"
            >
              <Package className="w-6 h-6" />
              <span className="text-xs mt-1">Menu</span>
            </button>
            <button
              onClick={() => setScreen('cart')}
              className="flex flex-col items-center text-muted-foreground relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs h-5 w-5 flex items-center justify-center p-0">
                  {cart.reduce((sum, item) => sum + item.qty, 0)}
                </Badge>
              )}
              <span className="text-xs mt-1">Keranjang</span>
            </button>
            <button
              onClick={() => setScreen('account')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Akun</span>
            </button>
          </div>
        </div>

        {/* Notification Dialog */}
        <Dialog open={showNotifications} onOpenChange={(open) => {
          setShowNotifications(open)
          if (open) markNotificationsAsRead()
        }}>
          <DialogContent className="max-w-md">
            <DialogTitle className="sr-only">Notifikasi</DialogTitle>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold">Notifikasi</h2>
            </div>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.type === 'order' ? CheckCircle :
                                  notif.type === 'promo' ? Star :
                                  notif.type === 'success' ? Gift : Bell
                    const iconColor = notif.type === 'order' ? 'text-green-600' :
                                     notif.type === 'promo' ? 'text-orange-600' :
                                     notif.type === 'success' ? 'text-orange-600' : 'text-gray-600'
                    const bgClass = notif.type === 'order' ? 'bg-green-100' :
                                     notif.type === 'promo' ? 'bg-orange-100' :
                                     notif.type === 'success' ? 'bg-orange-100' : 'bg-gray-100'
                    const timeAgo = formatTimeAgo(notif.createdAt)

                    return (
                      <Card key={notif.id} className={notif.isRead ? 'opacity-60' : ''}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog open={showChat} onOpenChange={(open) => {
          setShowChat(open)
          if (open) markChatAsRead()
        }}>
          <DialogContent className="max-w-sm h-[500px] flex flex-col p-0">
            <DialogTitle className="sr-only">Customer Service</DialogTitle>
            <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-orange-400">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Customer Service</h2>
              </div>
              <p className="text-white/80 text-sm mt-1">Online • Biasanya membalas dalam 5 menit</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada percakapan</p>
                    <p className="text-sm mt-2">Mulai dengan mengirim pesan</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isAdmin = msg.senderRole === 'admin'
                    const time = new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAdmin ? '' : 'justify-end'}`}>
                        {isAdmin ? (
                          <>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👨‍💼</span>
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{time}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-white/80 mt-1">{time}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👤</span>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Tulis pesan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
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
                  <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ========== CART SCREEN ==========
  if (screen === 'cart') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <Header
          memberName={memberData?.user?.name || user?.name || 'Guest'}
          memberAvatar={memberData?.user?.avatar || user?.avatar || null}
          notificationCount={notificationCount}
          onNotificationClick={() => setShowNotifications(true)}
          onChatClick={() => setShowChat(true)}
        />

        {/* Cart Items */}
        <div className="p-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground">Keranjang kosong</p>
              <Button
                onClick={() => setScreen('menu')}
                className="mt-4 bg-orange-500 hover:bg-orange-600"
              >
                Lihat Menu
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 bg-orange-50 rounded-lg flex items-center justify-center text-4xl overflow-hidden">
                          {item.product.image?.startsWith('data:') ? (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{item.product.image || '🍗'}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.product.name}</h3>
                          <p className="text-orange-600 font-bold text-sm">
                            Rp {item.product.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQty(item.product.id, -1)}
                              className="h-7 w-7 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.qty}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQty(item.product.id, 1)}
                              className="h-7 w-7 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Voucher & Points */}
              <div className="space-y-3 mb-4">
                {/* Voucher Input */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">Kode Voucher</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Masukkan kode voucher"
                          value={voucherCode}
                          onChange={(e) => {
                            setVoucherCode(e.target.value.toUpperCase())
                            if (appliedVoucher) {
                              setAppliedVoucher(null)
                              setIsVoucherValid(null)
                              setVoucherError('')
                            }
                          }}
                          disabled={appliedVoucher !== null || isValidatingVoucher}
                          className="flex-1 uppercase"
                        />
                        {appliedVoucher ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setAppliedVoucher(null)
                              setVoucherCode('')
                              setIsVoucherValid(null)
                              setVoucherError('')
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (!voucherCode.trim()) {
                                setVoucherError('Masukkan kode voucher')
                                return
                              }

                              setIsValidatingVoucher(true)
                              setVoucherError('')

                              try {
                                const cartTotal = getCartTotal()
                                const response = await fetch('/api/voucher/validate', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    code: voucherCode.trim().toUpperCase(),
                                    userId: user?.id,
                                    cartTotal
                                  })
                                })

                                const data = await response.json()

                                if (data.valid) {
                                  setAppliedVoucher(data.voucher)
                                  setIsVoucherValid(true)
                                  toast({
                                    title: 'Voucher Berhasil!',
                                    description: `Diskon ${data.voucher.discount > 0 ? 'Rp ' + data.voucher.discount.toLocaleString() : data.voucher.discountPercent + '%'} telah diterapkan`,
                                  })
                                } else {
                                  setIsVoucherValid(false)
                                  setVoucherError(data.error || 'Voucher tidak valid')
                                }
                              } catch (error) {
                                console.error('Error validating voucher:', error)
                                setVoucherError('Gagal memvalidasi voucher')
                                setIsVoucherValid(false)
                              } finally {
                                setIsValidatingVoucher(false)
                              }
                            }}
                            disabled={isValidatingVoucher}
                          >
                            {isValidatingVoucher ? '...' : 'Terapkan'}
                          </Button>
                        )}
                      </div>
                      {voucherError && (
                        <Alert className="bg-red-50 border-red-200 p-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <AlertDescription className="text-sm text-red-800">{voucherError}</AlertDescription>
                        </Alert>
                      )}
                      {appliedVoucher && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-800">{appliedVoucher.name}</span>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              {appliedVoucher.discount > 0
                                ? `-Rp ${appliedVoucher.discount.toLocaleString()}`
                                : `-${appliedVoucher.discountPercent}%`
                              }
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">Gunakan Poin</span>
                      </div>
                      <Badge variant="outline">{points} Poin</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rp {getCartTotal().toLocaleString()}</span>
                  </div>
                  {appliedVoucher && appliedVoucher.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon Voucher</span>
                      <span>-Rp {appliedVoucher.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak (10%)</span>
                    <span>Rp {(getCartTotal() * 0.1).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">
                      Rp {(getCartTotal() * 1.1 - (appliedVoucher?.discount || 0)).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button
                onClick={() => setScreen('checkout')}
                className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-lg mt-4"
              >
                Checkout
              </Button>
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
          <div className="flex justify-around">
            <button
              onClick={() => setScreen('home')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setScreen('menu')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <Package className="w-6 h-6" />
              <span className="text-xs mt-1">Menu</span>
            </button>
            <button
              onClick={() => setScreen('cart')}
              className="flex flex-col items-center text-orange-500 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs h-5 w-5 flex items-center justify-center p-0">
                  {cart.reduce((sum, item) => sum + item.qty, 0)}
                </Badge>
              )}
              <span className="text-xs mt-1">Keranjang</span>
            </button>
            <button
              onClick={() => setScreen('account')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Akun</span>
            </button>
          </div>
        </div>

        {/* Notification Dialog */}
        <Dialog open={showNotifications} onOpenChange={(open) => {
          setShowNotifications(open)
          if (open) markNotificationsAsRead()
        }}>
          <DialogContent className="max-w-md">
            <DialogTitle className="sr-only">Notifikasi</DialogTitle>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold">Notifikasi</h2>
            </div>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.type === 'order' ? CheckCircle :
                                  notif.type === 'promo' ? Star :
                                  notif.type === 'success' ? Gift : Bell
                    const iconColor = notif.type === 'order' ? 'text-green-600' :
                                     notif.type === 'promo' ? 'text-orange-600' :
                                     notif.type === 'success' ? 'text-orange-600' : 'text-gray-600'
                    const bgClass = notif.type === 'order' ? 'bg-green-100' :
                                     notif.type === 'promo' ? 'bg-orange-100' :
                                     notif.type === 'success' ? 'bg-orange-100' : 'bg-gray-100'
                    const timeAgo = formatTimeAgo(notif.createdAt)

                    return (
                      <Card key={notif.id} className={notif.isRead ? 'opacity-60' : ''}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog open={showChat} onOpenChange={(open) => {
          setShowChat(open)
          if (open) markChatAsRead()
        }}>
          <DialogContent className="max-w-sm h-[500px] flex flex-col p-0">
            <DialogTitle className="sr-only">Customer Service</DialogTitle>
            <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-orange-400">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Customer Service</h2>
              </div>
              <p className="text-white/80 text-sm mt-1">Online • Biasanya membalas dalam 5 menit</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada percakapan</p>
                    <p className="text-sm mt-2">Mulai dengan mengirim pesan</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isAdmin = msg.senderRole === 'admin'
                    const time = new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAdmin ? '' : 'justify-end'}`}>
                        {isAdmin ? (
                          <>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👨‍💼</span>
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{time}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-white/80 mt-1">{time}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👤</span>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Tulis pesan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
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
                  <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ========== CHECKOUT SCREEN ==========
  if (screen === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50 pb-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4 pt-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScreen('cart')}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
            <h1 className="text-white text-xl font-bold">Checkout</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Payment Method */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Metode Pembayaran</span>
              </div>
              <div className="space-y-2">
                {loadingPaymentMethods ? (
                  <div className="text-center py-4 text-gray-500">Memuat metode pembayaran...</div>
                ) : paymentMethods.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Tidak ada metode pembayaran tersedia</div>
                ) : (
                  paymentMethods.filter((pm) => pm.isActive).map((pm) => (
                    <div
                      key={pm.id}
                      onClick={() => setSelectedPaymentMethod(pm.name)}
                      className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPaymentMethod === pm.name
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {pm.icon ? (
                          <span className="text-2xl">{pm.icon}</span>
                        ) : pm.name === 'qris' ? (
                          <QrCode className="w-6 h-6 text-orange-500" />
                        ) : pm.name === 'transfer' ? (
                          <WalletCards className="w-6 h-6 text-gray-500" />
                        ) : (
                          <Wallet className="w-6 h-6 text-gray-500" />
                        )}
                        <div>
                          <p className="font-medium">{pm.displayName}</p>
                          <p className="text-sm text-muted-foreground">{pm.description}</p>
                        </div>
                      </div>
                      {selectedPaymentMethod === pm.name && (
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
              <div className="space-y-2 text-sm">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>{item.product.name} x{item.qty}</span>
                    <span>Rp {(item.product.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak (10%)</span>
                  <span>Rp {(getCartTotal() * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-orange-600">
                    Rp {(getCartTotal() * 1.1).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirm Button */}
          <Button
            onClick={async () => {
              if (!user?.id) {
                toast({
                  title: 'Login Diperlukan',
                  description: 'Silakan login untuk membuat pesanan',
                  variant: 'destructive'
                })
                return
              }

              if (!selectedPaymentMethod) {
                toast({
                  title: 'Metode Pembayaran',
                  description: 'Silakan pilih metode pembayaran',
                  variant: 'destructive'
                })
                return
              }

              if (cart.length === 0) {
                toast({
                  title: 'Keranjang Kosong',
                  description: 'Silakan tambahkan produk ke keranjang',
                  variant: 'destructive'
                })
                return
              }

              setIsCreatingOrder(true)
              try {
                const response = await fetch('/api/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: user.id,
                    paymentMethod: selectedPaymentMethod,
                    address: addresses.find(a => a.isDefault)?.address || addresses[0]?.address,
                    note: '',
                    items: cart.map(item => ({
                      productId: item.product.id,
                      productName: item.product.name,
                      qty: item.qty,
                      price: item.product.price
                    }))
                  })
                })

                const data = await response.json()

                if (response.ok) {
                  // Set last order ID for PDF generation
                  setLastOrderId(data.order.id)

                  // Update orders list
                  setOrders([...orders, {
                    id: data.order.id,
                    orderNumber: data.order.orderNumber,
                    status: data.order.status,
                    total: data.order.total,
                    items: cart,
                    createdAt: data.order.createdAt
                  }])

                  // Clear cart
                  setCart([])

                  // Move to order status
                  setScreen('orderStatus')

                  toast({
                    title: 'Pesanan Berhasil',
                    description: `Order #${data.order.orderNumber} telah dibuat`,
                  })
                } else {
                  throw new Error(data.error || 'Gagal membuat pesanan')
                }
              } catch (error) {
                console.error('Error creating order:', error)
                toast({
                  title: 'Gagal Membuat Pesanan',
                  description: error instanceof Error ? error.message : 'Terjadi kesalahan',
                  variant: 'destructive'
                })
              } finally {
                setIsCreatingOrder(false)
              }
            }}
            disabled={isCreatingOrder || cart.length === 0}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-lg"
          >
            {isCreatingOrder ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </span>
            ) : (
              'Konfirmasi Pesanan'
            )}
          </Button>
        </div>
      </div>
    )
  }

  // ========== ORDER STATUS SCREEN ==========
  if (screen === 'orderStatus') {
    const latestOrder = orders[orders.length - 1]
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <Header
          memberName={memberData?.user?.name || user?.name || 'Guest'}
          memberAvatar={memberData?.user?.avatar || user?.avatar || null}
          notificationCount={notificationCount}
          onNotificationClick={() => setShowNotifications(true)}
          onChatClick={() => setShowChat(true)}
        />

        <div className="p-4">
          {/* Order Info */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">🍳</div>
                <h2 className="text-2xl font-bold mb-2">Sedang Diproses</h2>
                <p className="text-muted-foreground">Order #{latestOrder?.orderNumber}</p>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Pesanan Diterima</p>
                    <p className="text-sm text-muted-foreground">Pesanan Anda telah masuk</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-6 h-6 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium">Sedang Diproses</p>
                    <p className="text-sm text-muted-foreground">Pesanan sedang disiapkan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <CheckCircle className="w-6 h-6" />
                  <div className="flex-1">
                    <p className="font-medium">Selesai</p>
                    <p className="text-sm text-muted-foreground">Pesanan siap diambil</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Time */}
          <Alert className="mb-4 bg-orange-50 border-orange-200">
            <ClockIcon className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Estimasi waktu penyelesaian: 15-20 menit
            </AlertDescription>
          </Alert>

          {/* Order Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Item Pesanan</h3>
              <div className="space-y-2">
                {latestOrder?.items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} x{item.qty}</span>
                    <span>Rp {(item.product.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">Rp {latestOrder?.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Receipt Button */}
          {lastOrderId && (
            <Button
              onClick={async () => {
                try {
                  const response = await fetch(`/api/orders/${lastOrderId}`)
                  if (response.ok) {
                    const data = await response.json()
                    setPreviewOrderData(data.order)
                    setShowReceiptPreviewDialog(true)
                  } else {
                    throw new Error('Gagal mengambil data pesanan')
                  }
                } catch (error) {
                  console.error('Error fetching order:', error)
                  toast({
                    title: 'Gagal Mengambil Pesanan',
                    description: 'Terjadi kesalahan saat mengambil data pesanan',
                    variant: 'destructive'
                  })
                }
              }}
              className="w-full mt-4 gap-2 bg-green-600 hover:bg-green-700"
            >
              <Receipt className="w-5 h-5" />
              Lihat & Download Struk
            </Button>
          )}
        </div>

        {/* Receipt Preview Dialog */}
        <Dialog open={showReceiptPreviewDialog} onOpenChange={setShowReceiptPreviewDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview Struk</DialogTitle>
              <DialogDescription>
                Cek struk sebelum download sebagai PDF
              </DialogDescription>
            </DialogHeader>

            {previewOrderData && (
              <div className="bg-gradient-to-b from-white to-orange-50 my-4 mx-auto max-w-sm shadow-lg border-2 border-orange-200 rounded-lg overflow-hidden">
                {/* Top Border */}
                <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500"></div>

                {/* Header */}
                <div className="text-center p-4 pb-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-2 shadow-lg">
                    <span className="text-3xl">🍗</span>
                  </div>
                  <h2 className="text-xl font-black text-orange-600 mb-1 tracking-tight">AYAM GEPREK SAMBAL IJO</h2>
                  <p className="text-xs text-orange-500 font-medium">🍗 Lezat • Pedas • Bikin Nagih</p>
                </div>

                {/* Address */}
                <div className="text-center px-4 pb-3 border-b border-dashed border-orange-300">
                  <p className="text-xs text-gray-600">Jl. Medan - Banda Aceh, Simpang Camat</p>
                  <p className="text-xs text-gray-600">Gampong Tijue, 24151</p>
                  <p className="text-xs text-gray-600 font-medium">WA: 085260812758</p>
                </div>

                {/* Order Info Card */}
                <div className="p-4 space-y-3">
                  {/* Order Number Badge */}
                  <div className="bg-orange-100 rounded-lg p-3 text-center border border-orange-300">
                    <p className="text-xs text-orange-600 font-medium">ORDER</p>
                    <p className="text-lg font-black text-orange-700">#{previewOrderData.orderNumber}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(previewOrderData.createdAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-semibold">{previewOrderData.user?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-semibold">{getPaymentMethodDisplayName(previewOrderData.paymentMethod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${getStatusBadgeColor(previewOrderData.status)}`}>
                        {getOrderStatusDisplay(previewOrderData.status).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 py-3 border-t border-dashed border-orange-300">
                  <div className="flex text-xs font-bold text-orange-600 mb-2 pb-2 border-b border-orange-300">
                    <span className="w-10">QTY</span>
                    <span className="flex-1">ITEM</span>
                    <span className="w-16 text-right">PRICE</span>
                    <span className="w-16 text-right">TOTAL</span>
                  </div>
                  <div className="space-y-2">
                    {previewOrderData?.items.map((item, idx) => (
                      <div key={idx} className="flex text-xs">
                        <span className="w-10 font-medium text-gray-700">{item.qty}x</span>
                        <span className="flex-1 text-gray-800">{item.product.name}</span>
                        <span className="w-16 text-right text-gray-600">Rp{item.price.toLocaleString()}</span>
                        <span className="w-16 text-right font-medium text-gray-800">Rp{item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="px-4 py-3 border-t border-dashed border-orange-300 bg-orange-50/50">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>Rp {previewOrderData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pajak (10%)</span>
                      <span>Rp {previewOrderData.tax.toLocaleString()}</span>
                    </div>
                    {previewOrderData.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon</span>
                        <span>-Rp {previewOrderData.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t-2 border-orange-400">
                      <span className="text-sm font-bold text-orange-700">TOTAL BAYAR</span>
                      <span className="text-lg font-black text-orange-600">Rp {previewOrderData.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {previewOrderData.note && (
                  <div className="px-4 py-2 border-t border-dashed border-orange-300">
                    <p className="text-xs text-gray-600 italic">Note: {previewOrderData.note}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="p-4 text-center border-t border-dashed border-orange-300 bg-gradient-to-b from-orange-50 to-white">
                  <p className="text-sm font-bold text-orange-600 mb-1">TERIMA KASIH</p>
                  <p className="text-xs text-gray-600 mb-2">Simpan struk ini sebagai bukti pembayaran</p>
                  <p className="text-xs text-gray-500 italic mb-3">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
                  <div className="flex justify-center items-center gap-2 text-xs text-gray-600">
                    <span>📱 Follow us:</span>
                    <span className="font-medium">@ayamgepreksambalijo</span>
                  </div>
                  <p className="text-xs text-orange-500 font-bold mt-2">⭐ Rate us & Leave Review!</p>
                </div>

                {/* Bottom Border */}
                <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500"></div>
              </div>
            )}

            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReceiptPreviewDialog(false)}
              >
                Tutup
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/orders/${previewOrderData?.id}/receipt`)
                    if (response.ok) {
                      const blob = await response.blob()
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `struk-${previewOrderData?.orderNumber}.pdf`
                      document.body.appendChild(a)
                      a.click()
                      window.URL.revokeObjectURL(url)
                      document.body.removeChild(a)

                      toast({
                        title: 'Struk Berhasil Diunduh',
                        description: 'File PDF struk telah diunduh',
                      })

                      setShowReceiptPreviewDialog(false)
                    } else {
                      throw new Error('Gagal mengunduh struk')
                    }
                  } catch (error) {
                    console.error('Error downloading receipt:', error)
                    toast({
                      title: 'Gagal Mengunduh Struk',
                      description: 'Terjadi kesalahan saat mengunduh struk',
                      variant: 'destructive'
                    })
                  }
                }}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
          <div className="flex justify-around">
            <button
              onClick={() => setScreen('home')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setScreen('menu')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <Package className="w-6 h-6" />
              <span className="text-xs mt-1">Menu</span>
            </button>
            <button
              onClick={() => setScreen('cart')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs mt-1">Keranjang</span>
            </button>
            <button
              onClick={() => setScreen('account')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Akun</span>
            </button>
          </div>
        </div>

        {/* Notification Dialog */}
        <Dialog open={showNotifications} onOpenChange={(open) => {
          setShowNotifications(open)
          if (open) markNotificationsAsRead()
        }}>
          <DialogContent className="max-w-md">
            <DialogTitle className="sr-only">Notifikasi</DialogTitle>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold">Notifikasi</h2>
            </div>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.type === 'order' ? CheckCircle :
                                  notif.type === 'promo' ? Star :
                                  notif.type === 'success' ? Gift : Bell
                    const iconColor = notif.type === 'order' ? 'text-green-600' :
                                     notif.type === 'promo' ? 'text-orange-600' :
                                     notif.type === 'success' ? 'text-orange-600' : 'text-gray-600'
                    const bgClass = notif.type === 'order' ? 'bg-green-100' :
                                     notif.type === 'promo' ? 'bg-orange-100' :
                                     notif.type === 'success' ? 'bg-orange-100' : 'bg-gray-100'
                    const timeAgo = formatTimeAgo(notif.createdAt)

                    return (
                      <Card key={notif.id} className={notif.isRead ? 'opacity-60' : ''}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog open={showChat} onOpenChange={(open) => {
          setShowChat(open)
          if (open) markChatAsRead()
        }}>
          <DialogContent className="max-w-sm h-[500px] flex flex-col p-0">
            <DialogTitle className="sr-only">Customer Service</DialogTitle>
            <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-orange-400">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Customer Service</h2>
              </div>
              <p className="text-white/80 text-sm mt-1">Online • Biasanya membalas dalam 5 menit</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada percakapan</p>
                    <p className="text-sm mt-2">Mulai dengan mengirim pesan</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isAdmin = msg.senderRole === 'admin'
                    const time = new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAdmin ? '' : 'justify-end'}`}>
                        {isAdmin ? (
                          <>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👨‍💼</span>
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{time}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-white/80 mt-1">{time}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👤</span>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Tulis pesan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
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
                  <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ========== ACCOUNT SCREEN ==========
  if (screen === 'account') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <Header
          memberName={memberData?.user?.name || user?.name || 'Guest'}
          memberAvatar={memberData?.user?.avatar || user?.avatar || null}
          notificationCount={notificationCount}
          unreadChatCount={unreadChatCount}
          onNotificationClick={() => setShowNotifications(true)}
          onChatClick={() => setShowChat(true)}
        />

        {/* Profile Card with Upload */}
        <div className="px-4 mt-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div
                    className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl overflow-hidden cursor-pointer border-2 border-orange-500"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    {(memberData?.user?.avatar || user?.avatar) ? (
                      <img
                        src={memberData?.user?.avatar || user?.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file && user?.id) {
                        const reader = new FileReader()
                        reader.onloadend = async () => {
                          const base64 = reader.result as string
                          try {
                            const response = await fetch('/api/profile', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                userId: user.id,
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                avatar: base64,
                              }),
                            })

                            if (response.ok) {
                              setUser({ ...user, avatar: base64 })
                              if (memberData) {
                                setMemberData({
                                  ...memberData,
                                  user: { ...memberData.user, avatar: base64 }
                                })
                              }
                              toast({
                                title: 'Foto Profil Berhasil Diubah',
                                description: 'Foto profil Anda telah diperbarui',
                              })
                            }
                          } catch (error) {
                            toast({
                              title: 'Gagal Mengubah Foto Profil',
                              description: 'Terjadi kesalahan',
                              variant: 'destructive',
                            })
                          }
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-orange-600">
                    <Edit3 className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{memberData?.user?.name || user?.name || 'John Doe'}</h2>
                  <p className="text-sm text-muted-foreground">{memberData?.user?.email || user?.email || 'john@example.com'}</p>
                  <button
                    onClick={() => {
                      setEditName(user?.name || '')
                      setEditEmail(user?.email || '')
                      setEditPhone(user?.phone || '')
                      setEditAddress(user?.address || memberData?.user?.address || '')
                      setEditAvatar(user?.avatar || memberData?.user?.avatar || null)
                      setShowEditProfile(true)
                    }}
                    className="mt-2 text-sm text-orange-500 hover:underline"
                  >
                    Edit Profil
                  </button>
                </div>
              </div>

              {/* Points & Member Card - Changed: Phone replaced with Points */}
              <div className={`${getCardGradient(getMemberTier(points))} rounded-xl p-4 text-white`}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm opacity-80">Poin Rewards</p>
                    <p className="font-bold text-2xl">{points.toLocaleString()}</p>
                  </div>
                  <Badge className="bg-white/20 border-none text-white">
                    {memberData?.tier || getMemberTier(points)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/60 text-xs mb-1">ID Member</p>
                    <p className="font-mono text-lg font-bold tracking-wider">
                      {memberId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs mb-1">No. HP</p>
                    <p className="font-semibold">{memberData?.user?.phone || user?.phone || '081234567890'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-4">
          <Tabs value={accountTab} onValueChange={(v) => setAccountTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <User className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Package className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="vouchers" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Tag className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Heart className="w-5 h-5" />
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Nama Lengkap</p>
                      <p className="text-sm text-muted-foreground">{memberData?.user?.name || user?.name || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{memberData?.user?.email || user?.email || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">No. HP</p>
                      <p className="text-sm text-muted-foreground">{memberData?.user?.phone || user?.phone || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alamat</p>
                      <p className="text-sm text-muted-foreground">{memberData?.user?.address || user?.address || 'Belum diatur'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Member Tier</p>
                      <p className="text-sm text-muted-foreground">{memberData?.tier || getMemberTier(points)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-4">
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Belum ada pesanan</p>
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge className={
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {order.status === 'completed' ? 'Selesai' :
                             order.status === 'processing' ? 'Diproses' :
                             order.status === 'pending' ? 'Menunggu' : order.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.product.name} x{item.qty}</span>
                              <span>{(item.product.price * item.qty).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">Total</p>
                          <p className="font-bold text-orange-600">Rp {order.total.toLocaleString()}</p>
                        </div>
                        <Button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/orders/${order.id}`)
                              if (response.ok) {
                                const data = await response.json()
                                setPreviewOrderData(data.order)
                                setShowReceiptPreviewDialog(true)
                              } else {
                                throw new Error('Gagal mengambil data pesanan')
                              }
                            } catch (error) {
                              console.error('Error fetching order:', error)
                              toast({
                                title: 'Gagal Mengambil Pesanan',
                                description: 'Terjadi kesalahan saat mengambil data pesanan',
                                variant: 'destructive'
                              })
                            }
                          }}
                          className="w-full mt-3 bg-orange-500 hover:bg-orange-600"
                        >
                          <Receipt className="w-4 h-4 mr-2" />
                          Lihat Struk
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Vouchers Tab */}
            <TabsContent value="vouchers" className="mt-4">
              <div className="space-y-3">
                {vouchers.filter(v => !v.isUsed).length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Tidak ada voucher aktif</p>
                    </CardContent>
                  </Card>
                ) : (
                  vouchers.filter(v => !v.isUsed).map((voucher) => (
                    <Card key={voucher.id} className="border-2 border-dashed border-orange-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-lg text-orange-600">{voucher.code}</p>
                            <p className="text-sm text-muted-foreground">
                              Diskon {voucher.discount}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Min. pembelian Rp {voucher.minOrder.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Berlaku sampai</p>
                            <p className="text-sm font-medium">{new Date(voucher.expiry).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-4">
              <div className="space-y-3">
                {favorites.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Belum ada favorite</p>
                      <p className="text-sm text-muted-foreground mt-2">Klik ikon ❤️ di menu untuk menambahkan favorite</p>
                    </CardContent>
                  </Card>
                ) : (
                  allProducts
                    .filter(p => favorites.includes(p.id))
                    .map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{product.image}</div>
                            <div className="flex-1">
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                              <p className="text-orange-600 font-bold mt-1">Rp {product.price.toLocaleString()}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setFavorites(favorites.filter(f => f !== product.id))
                                toast({
                                  title: 'Dihapus dari Favorite',
                                  description: `${product.name} dihapus dari favorite`,
                                })
                              }}
                            >
                              <XCircle className="w-5 h-5 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          <Card>
            <CardContent className="p-0">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => setShowExchangePoints(true)}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-orange-500" />
                  <span>Tukar Poin</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => setShowSecurityPrivacy(true)}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <span>Keamanan dan Privasi</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => setShowNotificationSettings(true)}
              >
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5 text-purple-500" />
                  <span>Pengaturan Notifikasi</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => setShowLanguageSettings(true)}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-500" />
                  <span>Bahasa</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => setShowPolicy(true)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span>Kebijakan</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => setShowHelpCenter(true)}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                  <span>Pusat Bantuan</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  toast({
                    title: 'Versi Aplikasi',
                    description: 'Versi 1.0.0',
                  })
                }}
              >
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span>Versi Aplikasi</span>
                </div>
                <span className="text-sm text-muted-foreground">1.0.0</span>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 text-red-500 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Keluar
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
          <div className="flex justify-around">
            <button
              onClick={() => setScreen('home')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setScreen('menu')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <Package className="w-6 h-6" />
              <span className="text-xs mt-1">Menu</span>
            </button>
            <button
              onClick={() => setScreen('cart')}
              className="flex flex-col items-center text-muted-foreground"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs mt-1">Keranjang</span>
            </button>
            <button
              onClick={() => setScreen('account')}
              className="flex flex-col items-center text-orange-500"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Akun</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profil</DialogTitle>
              <DialogDescription>Ubah informasi profil Anda</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div
                    className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl overflow-hidden border-2 border-orange-500"
                  >
                    {editAvatar ? (
                      <img
                        src={editAvatar}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <input
                    type="file"
                    id="edit-avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setEditAvatar(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <label
                    htmlFor="edit-avatar-upload"
                    className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Klik ikon pensil untuk ubah foto
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Nomor Telepon</Label>
                <Input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="081234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>Alamat</Label>
                <Textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap Anda"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowEditProfile(false)
                setEditAvatar(null)
              }}>
                Batal
              </Button>
              <Button onClick={handleEditProfile} className="bg-orange-500 hover:bg-orange-600">
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Logout Confirmation Dialog */}
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Keluar</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin keluar dari akun?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                Batal
              </Button>
              <Button
                onClick={confirmLogout}
                variant="destructive"
              >
                Ya, Keluar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Exchange Points Dialog - 2 Column Grid */}
        <Dialog open={showExchangePoints} onOpenChange={setShowExchangePoints}>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400 p-4 relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <DialogTitle className="text-white text-xl font-bold">Tukar Poin</DialogTitle>
                    <DialogDescription className="text-orange-100 text-xs">
                      Dapatkan voucher eksklusif dengan poin Anda
                    </DialogDescription>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Points display */}
                <div className="bg-white/25 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs font-medium mb-1">Poin Tersedia</p>
                      <p className="text-white text-2xl font-bold tracking-tight">{points.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-400/30 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-200 fill-yellow-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Rewards Section - Grid Layout */}
            <div className="flex-1 bg-gray-50 p-4 overflow-auto">
              <p className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Pilih Voucher yang Ingin Ditukar
              </p>

              <div className="grid grid-cols-2 gap-3">
                {loadingRedeemProducts ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Memuat hadiah...
                  </div>
                ) : redeemProducts.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Tidak ada hadiah tersedia saat ini
                  </div>
                ) : (
                  redeemProducts
                    .filter((rp) => rp.isActive)
                    .map((rp) => {
                      // Determine gradient based on index for variety
                      const gradients = [
                        'from-orange-500 to-amber-500',
                        'from-blue-500 to-indigo-600',
                        'from-green-500 to-emerald-600',
                        'from-teal-500 to-green-600',
                        'from-purple-500 to-violet-600',
                        'from-rose-500 to-pink-600'
                      ]
                      const gradient = gradients[rp.sortOrder % gradients.length]
                      const bgGradient = `bg-gradient-to-br ${gradient}`
                      const isSelected = selectedReward === rp.id
                      const outOfStock = rp.stock > 0 && rp.stock <= 0

                      return (
                        <Card
                          key={rp.id}
                          disabled={outOfStock}
                          className={`cursor-pointer border-2 transition-all hover:shadow-lg hover:scale-[1.02] ${
                            isSelected
                              ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-orange-300'
                          } ${outOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !outOfStock && setSelectedReward(rp.id)}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className={`w-12 h-12 ${bgGradient} rounded-xl flex items-center justify-center shadow-md mx-auto`}>
                                {rp.image ? (
                                  <span className="text-2xl">{rp.image}</span>
                                ) : (
                                  <Gift className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-sm text-gray-900 mb-1 leading-tight line-clamp-2">
                                  {rp.name}
                                </p>
                                <Badge className={`bg-gradient-to-r ${gradient} text-white text-[10px] py-0.5 px-2`}>
                                  {rp.points} Poin
                                </Badge>
                              </div>
                              <div className="space-y-1 text-[10px] text-gray-600 border-t pt-1.5">
                                <div className="flex items-center gap-1 justify-center">
                                  <Tag className="w-3 h-3 text-orange-500" />
                                  <span className="truncate">{rp.description || 'Tukarkan poin Anda'}</span>
                                </div>
                                {outOfStock && (
                                  <div className="flex items-center gap-1 justify-center text-red-500">
                                    <XCircle className="w-3 h-3" />
                                    <span>Habis</span>
                                  </div>
                                )}
                                {rp.stock > 0 && rp.stock <= 10 && (
                                  <div className="flex items-center gap-1 justify-center text-orange-500">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{rp.stock} tersisa</span>
                                  </div>
                                )}
                              </div>
                              <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center mx-auto">
                                {isSelected && <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                )}
              </div>
            </div>

            <DialogFooter className="p-3 border-t bg-white flex-shrink-0 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowExchangePoints(false)
                  setSelectedReward(null)
                }}
                disabled={isExchanging}
                className="min-w-[80px] text-sm"
                size="sm"
              >
                Batal
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedReward) {
                    toast({
                      title: 'Pilih Hadiah',
                      description: 'Silakan pilih hadiah yang ingin ditukar',
                      variant: 'destructive'
                    })
                    return
                  }

                  // Find selected redeem product
                  const selectedProduct = redeemProducts.find((rp) => rp.id === selectedReward)
                  if (!selectedProduct) {
                    toast({
                      title: 'Produk Tidak Ditemukan',
                      description: 'Hadiah yang dipilih tidak tersedia',
                      variant: 'destructive'
                    })
                    return
                  }

                  const requiredPoints = selectedProduct.points
                  if (points < requiredPoints) {
                    toast({
                      title: 'Poin Tidak Cukup',
                      description: `Anda membutuhkan ${requiredPoints} poin untuk menukar hadiah ini`,
                      variant: 'destructive'
                    })
                    return
                  }

                  setIsExchanging(true)
                  try {
                    const response = await fetch('/api/redeem', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user?.id,
                        redeemProductId: selectedReward
                      })
                    })

                    const data = await response.json()

                    if (response.ok) {
                      setPoints(points - requiredPoints)
                      setGeneratedVoucher(data.voucher)
                      setShowExchangePoints(false)
                      setShowVoucherSuccess(true)
                      setSelectedReward(null)
                      toast({
                        title: 'Voucher Berhasil Dibuat!',
                        description: 'Kode voucher telah tersimpan di akun Anda',
                      })
                    } else {
                      throw new Error(data.error || 'Gagal membuat voucher')
                    }
                  } catch (error) {
                    console.error('Error redeeming product:', error)
                    toast({
                      title: 'Gagal Membuat Voucher',
                      description: 'Terjadi kesalahan saat membuat voucher',
                      variant: 'destructive'
                    })
                  } finally {
                    setIsExchanging(false)
                  }
                }}
                disabled={isExchanging || !selectedReward}
                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white min-w-[100px] shadow-lg text-sm"
                size="sm"
              >
                {isExchanging ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  'Tukar Poin'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Voucher Success Dialog */}
        <Dialog open={showVoucherSuccess} onOpenChange={setShowVoucherSuccess}>
          <DialogContent className="max-w-md text-center p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <DialogTitle className="text-white text-2xl font-bold mb-2">Voucher Berhasil!</DialogTitle>
                <DialogDescription className="text-green-100">
                  Kode voucher Anda siap digunakan
                </DialogDescription>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl p-6 mb-4">
                <p className="text-sm text-gray-600 mb-2 font-medium">Kode Voucher</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-gray-900 tracking-wider">{generatedVoucher?.code}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedVoucher?.code)
                      toast({
                        title: 'Kode Disalin!',
                        description: 'Kode voucher telah disalin ke clipboard',
                      })
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4 mb-4 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{generatedVoucher?.name}</p>
                    <p className="text-sm text-gray-600">Voucher sekali pakai</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {generatedVoucher?.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Nilai Diskon</span>
                      <span className="font-semibold text-orange-600">Rp {generatedVoucher.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {generatedVoucher?.discountPercent > 0 && (
                    <div className="flex justify-between">
                      <span>Diskon Persentase</span>
                      <span className="font-semibold text-orange-600">{generatedVoucher.discountPercent}%</span>
                    </div>
                  )}
                  {generatedVoucher?.minPurchase > 0 && (
                    <div className="flex justify-between">
                      <span>Min. Pembelian</span>
                      <span>Rp {generatedVoucher.minPurchase.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Berlaku Hingga</span>
                    <span className="font-medium">{new Date(generatedVoucher?.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Gunakan kode voucher ini di halaman keranjang belanja saat checkout
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter className="p-4 border-t bg-gray-50">
              <Button
                onClick={() => {
                  setShowVoucherSuccess(false)
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full"
              >
                Mengerti
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Security & Privacy Dialog */}
        <Dialog open={showSecurityPrivacy} onOpenChange={setShowSecurityPrivacy}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Keamanan dan Privasi</DialogTitle>
              <DialogDescription>
                Kelola pengaturan keamanan dan privasi akun Anda
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-96 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">Ubah Password</p>
                      <p className="text-xs text-muted-foreground">Keamanan akun Anda</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)}>
                    Ubah
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Tambahkan lapisan keamanan ekstra</p>
                    </div>
                  </div>
                  <Button 
                    variant={twoFactorEnabled ? "default" : "outline"} 
                    size="sm"
                    className={twoFactorEnabled ? "bg-orange-500 hover:bg-orange-600" : ""}
                    onClick={handleToggle2FA}
                  >
                    {twoFactorEnabled ? 'Aktif' : 'Aktifkan'}
                  </Button>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-3">Privasi</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <EyeOff className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-sm">Profil Privat</p>
                          <p className="text-xs text-muted-foreground">Sembunyikan profil dari pengguna lain</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={privacySettings.privateProfile}
                        onChange={(e) => handlePrivacyChange('privateProfile', e.target.checked)}
                        className="w-5 h-5 accent-orange-500" 
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-sm">Lokasi</p>
                          <p className="text-xs text-muted-foreground">Izinkan akses lokasi</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={privacySettings.locationAccess}
                        onChange={(e) => handlePrivacyChange('locationAccess', e.target.checked)}
                        className="w-5 h-5 accent-orange-500" 
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-3">Data Pribadi</p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleDownloadData}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Unduh Data Saya
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" 
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus Akun
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setShowSecurityPrivacy(false)} className="bg-orange-500 hover:bg-orange-600">
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Password</DialogTitle>
              <DialogDescription>
                Masukkan password saat ini dan password baru Anda
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Password Saat Ini</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Masukkan password saat ini"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Password minimal 6 karakter</p>
              </div>
              <div className="space-y-2">
                <Label>Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Ulangi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowChangePassword(false)
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
              }}>
                Batal
              </Button>
              <Button 
                onClick={handleChangePassword}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Simpan Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notification Settings Dialog */}
        <Dialog open={showNotificationSettings} onOpenChange={setShowNotificationSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Pengaturan Notifikasi</DialogTitle>
              <DialogDescription>
                Pilih jenis notifikasi yang ingin Anda terima
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm">Update Pesanan</p>
                    <p className="text-xs text-muted-foreground">Status pesanan & pengiriman</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.orderUpdates}
                  onChange={(e) => setNotificationSettings({...notificationSettings, orderUpdates: e.target.checked})}
                  className="w-5 h-5 accent-orange-500" 
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-sm">Promo & Diskon</p>
                    <p className="text-xs text-muted-foreground">Penawaran khusus member</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.promotions}
                  onChange={(e) => setNotificationSettings({...notificationSettings, promotions: e.target.checked})}
                  className="w-5 h-5 accent-orange-500" 
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Produk Baru</p>
                    <p className="text-xs text-muted-foreground">Menu terbaru dari kami</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.newProducts}
                  onChange={(e) => setNotificationSettings({...notificationSettings, newProducts: e.target.checked})}
                  className="w-5 h-5 accent-orange-500" 
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Newsletter</p>
                    <p className="text-xs text-muted-foreground">Info & tips menarik</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.newsletters}
                  onChange={(e) => setNotificationSettings({...notificationSettings, newsletters: e.target.checked})}
                  className="w-5 h-5 accent-orange-500" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotificationSettings(false)}>
                Batal
              </Button>
              <Button 
                onClick={() => {
                  setShowNotificationSettings(false)
                  toast({
                    title: 'Pengaturan Disimpan',
                    description: 'Preferensi notifikasi Anda telah diperbarui',
                  })
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Language Settings Dialog */}
        <Dialog open={showLanguageSettings} onOpenChange={setShowLanguageSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bahasa</DialogTitle>
              <DialogDescription>
                Pilih bahasa yang Anda inginkan
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Card 
                className={`cursor-pointer border-2 transition-colors ${selectedLanguage === 'id' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                onClick={() => setSelectedLanguage('id')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇮🇩</span>
                      <div>
                        <p className="font-semibold">Bahasa Indonesia</p>
                        <p className="text-sm text-muted-foreground">Indonesian</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center">
                      {selectedLanguage === 'id' && <div className="w-4 h-4 bg-orange-500 rounded-full" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer border-2 transition-colors ${selectedLanguage === 'en' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                onClick={() => setSelectedLanguage('en')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇺🇸</span>
                      <div>
                        <p className="font-semibold">English</p>
                        <p className="text-sm text-muted-foreground">English (US)</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center">
                      {selectedLanguage === 'en' && <div className="w-4 h-4 bg-orange-500 rounded-full" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer border-2 transition-colors ${selectedLanguage === 'zh' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                onClick={() => setSelectedLanguage('zh')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇨🇳</span>
                      <div>
                        <p className="font-semibold">中文</p>
                        <p className="text-sm text-muted-foreground">Chinese (Simplified)</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center">
                      {selectedLanguage === 'zh' && <div className="w-4 h-4 bg-orange-500 rounded-full" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLanguageSettings(false)}>
                Batal
              </Button>
              <Button 
                onClick={() => {
                  setShowLanguageSettings(false)
                  toast({
                    title: 'Bahasa Diubah',
                    description: 'Bahasa aplikasi telah diperbarui',
                  })
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Policy Dialog */}
        <Dialog open={showPolicy} onOpenChange={setShowPolicy}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Kebijakan</DialogTitle>
              <DialogDescription>
                Kebijakan dan ketentuan penggunaan aplikasi
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-96 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Kebijakan Privasi</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Kami menghargai privasi Anda. Informasi pribadi yang Anda berikan akan digunakan untuk meningkatkan layanan kami dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Syarat & Ketentuan</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dengan menggunakan aplikasi ini, Anda menyetujui untuk mematuhi semua syarat dan ketentuan yang berlaku. Penggunaan yang melanggar dapat mengakibatkan penangguhan akun.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Kebijakan Pengembalian</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pengembalian atau penukaran produk dapat dilakukan dalam waktu 24 jam setelah pemesanan jika terdapat masalah dengan produk. Silakan hubungi customer service untuk bantuan.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Kebijakan Poin & Rewards</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Poin rewards diperoleh dari setiap pembelian dan dapat ditukarkan dengan hadiah yang tersedia. Poin tidak dapat ditransfer ke akun lain dan berlaku selama 1 tahun.
                  </p>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button 
                onClick={() => setShowPolicy(false)} 
                className="bg-orange-500 hover:bg-orange-600 w-full"
              >
                Saya Mengerti
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Help Center Dialog */}
        <Dialog open={showHelpCenter} onOpenChange={setShowHelpCenter}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Pusat Bantuan</DialogTitle>
              <DialogDescription>
                Temukan jawaban untuk pertanyaan Anda
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-96 py-4">
              <div className="space-y-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({
                  title: 'Cara Pesan',
                  description: 'Pilih menu yang Anda inginkan, tambahkan ke keranjang, dan lakukan checkout',
                })}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Cara Memesan</p>
                        <p className="text-xs text-muted-foreground">Panduan pemesanan makanan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({
                  title: 'Cara Bayar',
                  description: 'Pilih metode pembayaran yang tersedia di halaman checkout',
                })}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Metode Pembayaran</p>
                        <p className="text-xs text-muted-foreground">Opsi pembayaran yang tersedia</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({
                  title: 'Poin Rewards',
                  description: 'Dapatkan poin dari setiap pembelian dan tukarkan dengan hadiah',
                })}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Poin Rewards</p>
                        <p className="text-xs text-muted-foreground">Cara mendapatkan dan menukar poin</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({
                  title: 'Lacak Pesanan',
                  description: 'Cek status pesanan Anda di halaman Akun > Pesanan',
                })}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Lacak Pesanan</p>
                        <p className="text-xs text-muted-foreground">Cek status pesanan Anda</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({
                  title: 'Kendala Login',
                  description: 'Gunakan fitur Lupa Password atau hubungi customer service',
                })}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Kendala Login</p>
                        <p className="text-xs text-muted-foreground">Solusi masalah akun</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button 
                onClick={() => {
                  setShowHelpCenter(false)
                  setShowChat(true)
                }} 
                className="bg-orange-500 hover:bg-orange-600 w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Hubungi Customer Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notification Dialog */}
        <Dialog open={showNotifications} onOpenChange={(open) => {
          setShowNotifications(open)
          if (open) markNotificationsAsRead()
        }}>
          <DialogContent className="max-w-md">
            <DialogTitle className="sr-only">Notifikasi</DialogTitle>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold">Notifikasi</h2>
            </div>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.type === 'order' ? CheckCircle :
                                  notif.type === 'promo' ? Star :
                                  notif.type === 'success' ? Gift : Bell
                    const iconColor = notif.type === 'order' ? 'text-green-600' :
                                     notif.type === 'promo' ? 'text-orange-600' :
                                     notif.type === 'success' ? 'text-orange-600' : 'text-gray-600'
                    const bgClass = notif.type === 'order' ? 'bg-green-100' :
                                     notif.type === 'promo' ? 'bg-orange-100' :
                                     notif.type === 'success' ? 'bg-orange-100' : 'bg-gray-100'
                    const timeAgo = formatTimeAgo(notif.createdAt)

                    return (
                      <Card key={notif.id} className={notif.isRead ? 'opacity-60' : ''}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 ${bgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog open={showChat} onOpenChange={(open) => {
          setShowChat(open)
          if (open) markChatAsRead()
        }}>
          <DialogContent className="max-w-sm h-[500px] flex flex-col p-0">
            <DialogTitle className="sr-only">Customer Service</DialogTitle>
            <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-orange-400">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Customer Service</h2>
              </div>
              <p className="text-white/80 text-sm mt-1">Online • Biasanya membalas dalam 5 menit</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada percakapan</p>
                    <p className="text-sm mt-2">Mulai dengan mengirim pesan</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isAdmin = msg.senderRole === 'admin'
                    const time = new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAdmin ? '' : 'justify-end'}`}>
                        {isAdmin ? (
                          <>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👨‍💼</span>
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{time}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-white/80 mt-1">{time}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👤</span>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Tulis pesan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
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
                  <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ========== POS SCREEN ==========
  if (screen === 'pos') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 pt-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScreen('login')}
                className="text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
              <h1 className="text-white text-xl font-bold">POS Kasir</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScreen('shift')}
                className="text-white hover:bg-white/20"
              >
                <ClockIcon className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Barcode Scanner */}
          <div className="bg-white/20 rounded-xl p-4 flex items-center gap-3">
            <Scan className="w-6 h-6 text-white" />
            <Input
              placeholder="Scan barcode produk..."
              className="bg-white/90 border-none"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {menuCategories.map(cat => (
              <Button
                key={typeof cat === 'string' ? cat : cat.id}
                variant={selectedCategory === (typeof cat === 'string' ? cat : cat.name) ? "default" : "outline"}
                onClick={() => setSelectedCategory(typeof cat === 'string' ? cat : cat.name)}
                size="sm"
                className={selectedCategory === (typeof cat === 'string' ? cat : cat.name) ? "bg-orange-500" : ""}
              >
                {typeof cat === 'string' ? (cat === 'all' ? 'Semua' : cat) : cat.name}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="grid grid-cols-3 gap-2">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow relative"
                  onClick={() => {
                    setPosCart(prev => {
                      const existing = prev.find(item => item.product.id === product.id)
                      if (existing) {
                        return prev.map(item =>
                          item.product.id === product.id
                            ? { ...item, qty: item.qty + 1 }
                            : item
                        )
                      }
                      return [...prev, { product, qty: 1 }]
                    })
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 z-10 bg-white/90 hover:bg-white shadow-sm h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </Button>
                  <CardContent className="p-2">
                    <div className="bg-orange-50 h-16 rounded-lg flex items-center justify-center text-2xl mb-2 overflow-hidden">
                      {product.image?.startsWith('data:') ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{product.image || '🍗'}</span>
                      )}
                    </div>
                    <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-orange-600 font-bold">
                      Rp {product.price.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* POS Cart Panel */}
        {posCart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div className="max-h-48 overflow-y-auto p-4">
              {posCart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center mb-2">
                  <span className="flex-1 text-sm">{item.product.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPosCart(prev => prev.map(i =>
                          i.product.id === item.product.id
                            ? { ...i, qty: Math.max(0, i.qty - 1) }
                            : i
                        ).filter(i => i.qty > 0))
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPosCart(prev => prev.map(i =>
                          i.product.id === item.product.id
                            ? { ...i, qty: i.qty + 1 }
                            : i
                        ))
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <span className="w-24 text-right text-sm font-medium">
                      Rp {(item.product.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-orange-600">
                  Rp {posCart.reduce((sum, item) => sum + item.product.price * item.qty, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 h-12 bg-orange-500 hover:bg-orange-600">
                      <QrCode className="w-5 h-5 mr-2" />
                      QRIS
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <div className="text-center p-6">
                      <QrCode className="w-48 h-48 mx-auto mb-4 text-gray-800" />
                      <h3 className="text-xl font-bold mb-2">Scan QRIS</h3>
                      <p className="text-muted-foreground mb-4">
                        Rp {posCart.reduce((sum, item) => sum + item.product.price * item.qty, 0).toLocaleString()}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button className="flex-1 h-12 bg-green-600 hover:bg-green-700">
                  <Wallet className="w-5 h-5 mr-2" />
                  Tunai
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ========== SHIFT SCREEN ==========
  if (screen === 'shift') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4 pt-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScreen('pos')}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
            <h1 className="text-white text-xl font-bold">Shift Kasir</h1>
          </div>
        </div>

        <div className="p-4">
          {!isShiftOpen ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                    💰
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Buka Shift</h2>
                  <p className="text-muted-foreground">Masukkan modal awal kasir</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Modal Awal (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={shiftAmount}
                      onChange={(e) => setShiftAmount(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>

                  <Button
                    onClick={() => setIsShiftOpen(true)}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-lg"
                  >
                    Buka Shift
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                    ✅
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Shift Aktif</h2>
                  <p className="text-muted-foreground">Mulai: {new Date().toLocaleTimeString('id-ID')}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-1">Modal Awal</p>
                    <p className="text-2xl font-bold text-orange-600">
                      Rp {shiftAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-lg">
                      Tutup Shift
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold">Tutup Shift</h3>
                      <div>
                        <Label>Saldo Fisik (Rp)</Label>
                        <Input type="number" placeholder="Masukkan jumlah fisik" />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Modal Awal</span>
                          <span>Rp {shiftAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold">Selisih</span>
                          <span className="font-bold text-green-600">Rp 0</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setIsShiftOpen(false)
                          setShiftAmount(0)
                        }}
                        className="w-full bg-red-500 hover:bg-red-600"
                      >
                        Konfirmasi Tutup Shift
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return null
}
