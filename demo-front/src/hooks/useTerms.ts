import { useCallback, useEffect, useState } from 'react'
import { termsApi } from '../api/auth'
import type { Term } from '../types/auth'

export function useTerms() {
  const [terms, setTerms] = useState<Term[]>([])
  const [agreed, setAgreed] = useState<Set<number>>(new Set())
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    termsApi.list().then(setTerms).catch(setError)
  }, [])

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

  return { terms, agreed, toggle, toggleAll, requiredOk, error }
}
