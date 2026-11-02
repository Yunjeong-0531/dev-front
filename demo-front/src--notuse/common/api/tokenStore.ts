import type { TokenResponse } from '@/common/types/session'

// 연동 확인용으로 localStorage 사용. 운영에서는 리프레시 토큰을 HttpOnly 쿠키로 옮기는 것을 권장 (XSS 대비).
const STORAGE_KEY = 'stay.auth'

type Listener = () => void
const listeners = new Set<Listener>()

export const tokenStore = {
  get(): TokenResponse | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as TokenResponse) : null
    } catch {
      return null
    }
  },
  set(tokens: TokenResponse) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    listeners.forEach((l) => l())
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY)
    listeners.forEach((l) => l())
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
