// OTP Storage for password reset
// In production, use Redis or database

interface OtpData {
  otp: string
  expiresAt: number
  email: string
  phone: string
  userId: string
}

class OtpStorage {
  private storage: Map<string, OtpData> = new Map()

  set(userId: string, data: OtpData) {
    this.storage.set(userId, data)
  }

  get(userId: string): OtpData | undefined {
    return this.storage.get(userId)
  }

  verify(userId: string, otp: string): boolean {
    const data = this.storage.get(userId)
    if (!data) return false

    // Check if expired
    if (Date.now() > data.expiresAt) {
      this.storage.delete(userId)
      return false
    }

    // Check OTP match
    if (data.otp !== otp) return false

    return true
  }

  delete(userId: string) {
    this.storage.delete(userId)
  }

  clearExpired() {
    const now = Date.now()
    for (const [userId, data] of this.storage.entries()) {
      if (now > data.expiresAt) {
        this.storage.delete(userId)
      }
    }
  }
}

export const otpStorage = new OtpStorage()
