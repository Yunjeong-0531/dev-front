import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { tokenStore } from '@/common/api/tokenStore'
import type { UserSummary } from '@/common/types/session'
import { AuthContext } from './auth-context'
import type { AuthContextValue } from './auth-context'

/**
 * 토큰 저장소(tokenStore)의 변화를 React 상태로 동기화한다.
 * 로그인/로그아웃으로 "사용자가 바뀌면" 쿼리 캐시를 비워, 이전 사용자의 데이터가 보이지 않게 한다.
 * (토큰 refresh 로 같은 사용자의 토큰만 갱신될 때는 캐시를 유지)
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<UserSummary | null>(() => tokenStore.get()?.user ?? null)
  const lastUserId = useRef<number | null>(user?.id ?? null)

  useEffect(
    () =>
      tokenStore.subscribe(() => {
        const next = tokenStore.get()?.user ?? null
        setUser(next)

        const nextId = next?.id ?? null
        if (lastUserId.current !== nextId) {
          lastUserId.current = nextId
          void queryClient.cancelQueries()
          queryClient.removeQueries() // mutation 캐시는 건드리지 않는다 (진행 중인 mutate 콜백 보호)
        }
      }),
    [queryClient],
  )

  const value = useMemo<AuthContextValue>(() => ({ user }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
