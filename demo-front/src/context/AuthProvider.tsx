import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '../api/auth'
import { tokenStore } from '../api/http'
import type { TokenResponse, UserSummary } from '../types/auth'
import { AuthContext } from './auth-context'
import type { AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(() => tokenStore.get()?.user ?? null)

  // 토큰이 바뀌면(refresh 성공, 만료로 인한 강제 로그아웃 등) 사용자 상태도 동기화
  useEffect(() => tokenStore.subscribe(() => setUser(tokenStore.get()?.user ?? null)), [])

  const applyTokens = useCallback((tokens: TokenResponse) => tokenStore.set(tokens), [])

  const login = useCallback(async (email: string, password: string) => {
    tokenStore.set(await authApi.login({ email, password }))
  }, [])

  const logout = useCallback(async () => {
    const current = tokenStore.get()
    try {
      if (current) await authApi.logout(current.refreshToken)
    } finally {
      tokenStore.clear() // 서버 호출이 실패해도 클라이언트는 로그아웃 처리
    }
  }, [])

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll()
    } finally {
      tokenStore.clear()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, applyTokens, logout, logoutAll }),
    [user, login, applyTokens, logout, logoutAll],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
