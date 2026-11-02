import { createContext, useContext } from 'react'
import type { UserSummary } from '@/common/types/session'

export interface AuthContextValue {
  /** 로그인한 사용자. 비로그인이면 null */
  user: UserSummary | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
