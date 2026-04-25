'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import {
  Bell,
  MessageCircle,
  LogOut,
  Utensils,
  Menu,
  X,
  XCircle,
  ShoppingCart,
  Home,
  Package,
  Users,
  BarChart3,
  Tag,
  CreditCard,
  Gift,
  Warehouse,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getToken, logout } from '@/lib/auth'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
  currentTab: string
  onTabChange: (tab: string) => void
  notifications: any[]
  unreadNotificationCount: number
}

export default function AdminLayout({
  children,
  currentTab,
  onTabChange,
  notifications,
  unreadNotificationCount
}: AdminLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Fetch user info
    fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.user) {
          setUser(data.user)
        } else {
          router.push('/admin/login')
        }
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'categories', label: 'Kategori', icon: Tag },
    { id: 'stock', label: 'Stok', icon: Warehouse },
    { id: 'users', label: 'Pelanggan', icon: Users },
    { id: 'cashiers', label: 'Kasir', icon: UserCog },
    { id: 'payments', label: 'Pembayaran', icon: CreditCard },
    { id: 'redeem', label: 'Tukar Poin', icon: Gift },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Ayam Geprek Sambal Ijo</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {user && (
                <>
                  <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadNotificationCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
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
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 rounded-lg border ${notif.isRead ? 'opacity-60 bg-gray-50' : 'bg-white'}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                  notif.type === 'order' ? 'bg-green-100' :
                                  notif.type === 'warning' ? 'bg-yellow-100' :
                                  notif.type === 'error' ? 'bg-red-100' :
                                  'bg-blue-100'
                                }`}>
                                  {notif.type === 'order' ? <ShoppingCart className="h-4 w-4 text-green-600" /> :
                                   notif.type === 'warning' ? <Settings className="h-4 w-4 text-yellow-600" /> :
                                   notif.type === 'error' ? <XCircle className="h-4 w-4 text-red-600" /> :
                                   <Bell className="h-4 w-4 text-blue-600" />}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{notif.title}</p>
                                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                  <p className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleString('id-ID')}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                              <p>Tidak ada notifikasi</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Keluar</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onTabChange={onTabChange}
          user={user}
          onLogout={handleLogout}
          unreadNotificationCount={unreadNotificationCount}
          unreadChatCount={0}
        />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-gray-50 pt-16">
            <ScrollArea className="h-full">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      variant={currentTab === tab.id ? 'default' : 'ghost'}
                      className={`w-full justify-start ${currentTab === tab.id ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                      onClick={() => {
                        onTabChange(tab.id)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.label}
                    </Button>
                  )
                })}
                {user && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Keluar
                  </Button>
                )}
              </nav>
            </ScrollArea>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
