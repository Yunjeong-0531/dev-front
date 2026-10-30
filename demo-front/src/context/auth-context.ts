import { createContext, useContext } from 'react'
import type { TokenResponse, UserSummary } from '../types/auth'

export interface AuthContextValue {
  user: UserSummary | null
  login: (email: string, password: string) => Promise<void>
  /** 로그인/소셜가입/비밀번호변경 등으로 받은 토큰을 저장 */
  applyTokens: (tokens: TokenResponse) => void
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
