import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { termsApi } from '../api/auth'
import type { Term } from '../types'
import { authKeys } from './queryKeys'

const EMPTY: Term[] = [] // 참조가 안정적이어야 아래 useCallback 이 매번 새로 만들어지지 않는다

/** 약관 목록 조회(useQuery) + 동의 체크 상태 관리 */
export function useTermsAgreement() {
  const query = useQuery({
    queryKey: authKeys.terms(),
    queryFn: termsApi.list,
    staleTime: 5 * 60_000,
  })
  const terms = query.data ?? EMPTY
  const [agreed, setAgreed] = useState<Set<number>>(new Set())

  const toggle = useCallback((id: number) => {
    setAgreed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAll = useCallback(
    (checked: boolean) => setAgreed(checked ? new Set(terms.map((t) => t.id)) : new Set()),
    [terms],
  )

  const requiredOk = terms.filter((t) => t.required).every((t) => agreed.has(t.id))

  return { terms, agreed, toggle, toggleAll, requiredOk, isLoading: query.isLoading, error: query.error }
}
