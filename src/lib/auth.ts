// Helper functions for client-side authentication

export const AUTH_TOKEN_KEY = 'auth_token'

export interface UserData {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string | null
  role: 'user' | 'cashier' | 'admin'
}

export interface AuthState {
  user: UserData | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isCashier: boolean
  isRegularUser: boolean
}

// Get token from localStorage
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

// Set token to localStorage
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

// Remove token from localStorage
export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

// Decode token
export function decodeToken(token: string): { userId: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

// Check if user has specific role
export function hasRole(user: UserData | null, role: string): boolean {
  return user?.role === role
}

// Check if user has any of the specified roles
export function hasAnyRole(user: UserData | null, roles: string[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

// Get auth state
export function getAuthState(): AuthState {
  const token = getToken()
  const decoded = token ? decodeToken(token) : null

  // Note: This only decodes the token, doesn't verify with server
  // For full verification, use the verify API endpoint
  if (!decoded) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isCashier: false,
      isRegularUser: false,
    }
  }

  return {
    user: null, // Will be populated from API response
    token,
    isAuthenticated: true,
    isAdmin: false,
    isCashier: false,
    isRegularUser: false,
  }
}

// Verify token with server
export async function verifyToken(token: string): Promise<{ user: UserData } | null> {
  try {
    const response = await fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch {
    return null
  }
}

// Login helper
export async function login(email: string, password: string): Promise<{
  success: boolean
  error?: string
  user?: UserData
  token?: string
}> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login gagal',
      }
    }

    setToken(data.token)

    return {
      success: true,
      user: data.user,
      token: data.token,
    }
  } catch {
    return {
      success: false,
      error: 'Terjadi kesalahan koneksi',
    }
  }
}

// Logout helper
export function logout(): void {
  removeToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}

// Redirect based on role
export function redirectToDashboard(role: string): void {
  switch (role) {
    case 'admin':
      window.location.href = '/admin/dashboard'
      break
    case 'cashier':
      window.location.href = '/?screen=pos'
      break
    default:
      window.location.href = '/'
      break
  }
}
