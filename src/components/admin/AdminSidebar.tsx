'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Bell,
  MessageCircle,
  Tag,
  CreditCard,
  Gift,
  Warehouse,
  UserCog,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Utensils,
  Settings
} from 'lucide-react'

interface SidebarTab {
  id: string
  label: string
  icon: any
  section?: string
  badge?: number
}

interface AdminSidebarProps {
  currentTab: string
  onTabChange: (tab: string) => void
  user?: any
  onLogout?: () => void
  unreadNotificationCount?: number
  unreadChatCount?: number
}

export default function AdminSidebar({
  currentTab,
  onTabChange,
  user,
  onLogout,
  unreadNotificationCount = 0,
  unreadChatCount = 0
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const mainTabs: SidebarTab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'categories', label: 'Kategori', icon: Tag },
    { id: 'stock', label: 'Stok', icon: Warehouse },
  ]

  const managementTabs: SidebarTab[] = [
    { id: 'users', label: 'Pelanggan', icon: Users },
    { id: 'cashiers', label: 'Kasir', icon: UserCog },
    { id: 'payments', label: 'Pembayaran', icon: CreditCard },
    { id: 'redeem', label: 'Tukar Poin', icon: Gift },
  ]

  const analysisTabs: SidebarTab[] = [
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
  ]

  const communicationTabs: SidebarTab[] = [
    { 
      id: 'notifications', 
      label: 'Notifikasi', 
      icon: Bell, 
      badge: unreadNotificationCount 
    },
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: MessageCircle,
      badge: unreadChatCount
    },
  ]

  const renderTab = (tab: SidebarTab) => {
    const Icon = tab.icon
    const isActive = currentTab === tab.id

    return (
      <Button
        key={tab.id}
        variant={isActive ? 'default' : 'ghost'}
        className={`w-full justify-start group transition-all duration-200 ${
          isActive 
            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
            : 'hover:bg-orange-50 hover:text-orange-600'
        }`}
        onClick={() => onTabChange(tab.id)}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && (
          <span className="ml-3 flex-1 text-left truncate">{tab.label}</span>
        )}
        {!collapsed && tab.badge && tab.badge > 0 && (
          <Badge className={`ml-2 ${
            isActive 
              ? 'bg-white text-orange-500 hover:bg-orange-50' 
              : 'bg-orange-500 text-white'
          }`}>
            {tab.badge}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* Logo & Collapse Button */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">Admin Panel</h3>
                <p className="text-xs text-gray-500 truncate">Ayam Geprek Sambal Ijo</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md mx-auto">
              <Utensils className="w-5 h-5 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto flex-shrink-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Main Navigation */}
          {!collapsed && (
            <div>
              <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Menu Utama
              </p>
            </div>
          )}
          <nav className="space-y-1">
            {mainTabs.map(renderTab)}
          </nav>

          {/* Management */}
          {!collapsed && (
            <div className="pt-4">
              <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Manajemen
              </p>
            </div>
          )}
          <nav className="space-y-1">
            {managementTabs.map(renderTab)}
          </nav>

          {/* Analysis */}
          {!collapsed && (
            <div className="pt-4">
              <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Analisis
              </p>
            </div>
          )}
          <nav className="space-y-1">
            {analysisTabs.map(renderTab)}
          </nav>

          {/* Communication */}
          {!collapsed && (
            <div className="pt-4">
              <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Komunikasi
              </p>
            </div>
          )}
          <nav className="space-y-1">
            {communicationTabs.map(renderTab)}
          </nav>
        </div>
      </ScrollArea>

      {/* User Profile */}
      {!collapsed && user && (
        <div className="p-4 border-t">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-600 capitalize truncate">{user.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed Logout Button */}
      {collapsed && (
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="icon"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </aside>
  )
}
