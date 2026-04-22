'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
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
  ClockIcon
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

// Header Component with Notification and Chat
interface HeaderProps {
  notificationCount?: number
  onNotificationClick?: () => void
  onChatClick?: () => void
  memberName?: string
  memberAvatar?: string | null
}

function Header({
  notificationCount = 0,
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
            className="text-white hover:bg-white/20"
          >
            <MessageCircle className="w-5 h-5" />
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
  const [points, setPoints] = useState(150)
  const [memberCardTab, setMemberCardTab] = useState<'card' | 'barcode'>('card')
  const [productTab, setProductTab] = useState<'populer' | 'terlaris' | 'terbaru'>('populer')
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

  // Notification & Chat state
  const [showNotifications, setShowNotifications] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
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

        // Set user data
        setIsLoggedIn(true)
        setUser(data.user)
        setScreen('home')

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
        }

        toast({
          title: 'Login Berhasil',
          description: 'Selamat datang kembali!',
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
    setIsLoggedIn(false)
    setUser(null)
    setMemberData(null)
    setCart([])
    setScreen('login')
    toast({
      title: 'Logout Berhasil',
      description: 'Sampai jumpa lagi!',
    })
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
      }
    } catch (error) {
      console.error('Failed to fetch chat messages:', error)
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

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'Main', 'Drink', 'Snack']

  // Helper functions to get products by tab
  const getPopulerProducts = () => {
    // Simulate popular products (higher price or specific products)
    return mockProducts.slice(0, 4)
  }

  const getTerlarisProducts = () => {
    // Simulate best-selling products (lower stock indicates more sales)
    return [...mockProducts].sort((a, b) => a.stock - b.stock).slice(0, 4)
  }

  const getTerbaruProducts = () => {
    // Simulate newest products (last 4 products in array)
    return mockProducts.slice(-4)
  }

  // Get products based on active tab
  const getTabProducts = () => {
    switch (productTab) {
      case 'populer':
        return getPopulerProducts()
      case 'terlaris':
        return getTerlarisProducts()
      case 'terbaru':
        return getTerbaruProducts()
      default:
        return getPopulerProducts()
    }
  }

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
                    <h3 className="font-bold text-xl">{memberData?.user?.phone || user?.phone || '081234567890'}</h3>
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
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">No. HP</p>
                      <p className="font-mono font-semibold">{memberData?.user?.phone || user?.phone || '081234567890'}</p>
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
                <div className="grid grid-cols-2 gap-3">
                  {getPopulerProducts().map(product => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedProduct(product); addToCart(product); }}>
                      <div className="bg-orange-50 h-28 flex items-center justify-center text-5xl">
                        {product.image}
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
              </TabsContent>

              {/* Terlaris Products */}
              <TabsContent value="terlaris" className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  {getTerlarisProducts().map(product => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedProduct(product); addToCart(product); }}>
                      <div className="bg-orange-50 h-28 flex items-center justify-center text-5xl">
                        {product.image}
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
              </TabsContent>

              {/* Terbaru Products */}
              <TabsContent value="terbaru" className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  {getTerbaruProducts().map(product => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedProduct(product); addToCart(product); }}>
                      <div className="bg-orange-50 h-28 flex items-center justify-center text-5xl">
                        {product.image}
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
          <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
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
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-orange-500 hover:bg-orange-600" : "whitespace-nowrap"}
              >
                {cat === 'all' ? 'Semua' : cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden">
                <div className="bg-orange-50 h-32 flex items-center justify-center text-6xl">
                  {product.image}
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
          <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
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
                        <div className="w-20 h-20 bg-orange-50 rounded-lg flex items-center justify-center text-4xl">
                          {item.product.image}
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
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">Voucher</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Pilih Voucher
                      </Button>
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
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak (10%)</span>
                    <span>Rp {(getCartTotal() * 0.1).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">
                      Rp {(getCartTotal() * 1.1).toLocaleString()}
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
          <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
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
                <div className="flex items-center justify-between p-3 border-2 border-orange-500 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-medium">QRIS</p>
                      <p className="text-sm text-muted-foreground">Scan QR Code untuk bayar</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Tunai</p>
                      <p className="text-sm text-muted-foreground">Bayar di kasir</p>
                    </div>
                  </div>
                </div>
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
            onClick={() => {
              setCart([])
              setOrders([...orders, {
                id: String(orders.length + 1),
                orderNumber: `ORD00${orders.length + 1}`,
                status: 'pending',
                total: getCartTotal() * 1.1,
                items: cart,
                createdAt: new Date()
              }])
              setScreen('orderStatus')
            }}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-lg"
          >
            Konfirmasi Pesanan
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
          <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
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
          onNotificationClick={() => setShowNotifications(true)}
          onChatClick={() => setShowChat(true)}
        />

        {/* Profile Card */}
        <div className="px-4 mt-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h2 className="text-xl font-bold">{memberData?.user?.name || user?.name || 'John Doe'}</h2>
                  <p className="text-sm text-muted-foreground">{memberData?.user?.email || user?.email || 'john@example.com'}</p>
                </div>
              </div>

              {/* Points & Member Card */}
              <div className={`${getCardGradient(getMemberTier(points))} rounded-xl p-4 text-white`}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm opacity-80">No. HP</p>
                    <p className="font-bold text-lg">{memberData?.user?.phone || user?.phone || '081234567890'}</p>
                  </div>
                  <Badge className="bg-white/20 border-none text-white">
                    {memberData?.tier || getMemberTier(points)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Poin Rewards</p>
                    <p className="text-3xl font-bold">{points.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs mb-1">ID Member</p>
                    <p className="font-mono text-2xl font-bold tracking-wider">
                      {memberId}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          <Card>
            <CardContent className="p-0">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-orange-500" />
                  <span>Riwayat Pesanan</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span>Pengaturan</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <Separator />
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                  <span>Bantuan</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

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
          <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
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
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
                className={selectedCategory === cat ? "bg-orange-500" : ""}
              >
                {cat === 'all' ? 'Semua' : cat}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="grid grid-cols-3 gap-2">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
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
                  <CardContent className="p-2">
                    <div className="bg-orange-50 h-16 rounded-lg flex items-center justify-center text-2xl mb-2">
                      {product.image}
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
