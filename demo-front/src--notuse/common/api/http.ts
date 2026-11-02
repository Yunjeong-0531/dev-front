import type { ErrorResponse } from '@/common/types/api'
import type { TokenResponse } from '@/common/types/session'
import { tokenStore } from './tokenStore'

/**
 * 모든 feature(auth, accommodation, ...)가 공유하는 HTTP 클라이언트.
 *  - auth: true 면 Authorization 헤더를 붙이고, 401 이면 refresh 후 1회 재시도
 *  - refresh 는 동시에 여러 요청이 401 이어도 "한 번만" 실행한다.
 *    (백엔드가 리프레시 토큰 rotation + 재사용 감지를 하므로 병렬 refresh 는 세션을 끊는다)
 *  - 이 로직은 TanStack Query 의 retry 에 맡기지 말고 여기서 처리할 것.
 */
const BASE: string = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  status: number
  code: string
  fieldErrors?: Record<string, string>

  constructor(status: number, code: string, message: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

async function toApiError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as ErrorResponse
    return new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? res.statusText, body.fieldErrors)
  } catch {
    return new ApiError(res.status, 'UNKNOWN', res.statusText || '요청에 실패했습니다.')
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  /** 로그인이 필요한 API 면 true */
  auth?: boolean
}

function doFetch(path: string, opts: RequestOptions, accessToken?: string) {
  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (opts.auth && accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  return fetch(BASE + path, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })
}

let refreshing: Promise<boolean> | null = null

export function refreshOnce(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      const current = tokenStore.get()
      if (!current) return false
      try {
        const res = await fetch(BASE + '/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: current.refreshToken }),
        })
        if (!res.ok) {
          tokenStore.clear() // 리프레시 토큰이 무효 → 로그아웃 상태로
          return false
        }
        tokenStore.set((await res.json()) as TokenResponse)
        return true
      } catch {
        return false // 네트워크 오류면 토큰은 유지
      }
    })().finally(() => {
      refreshing = null
    })
  }
  return refreshing
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  let res = await doFetch(path, opts, tokenStore.get()?.accessToken)

  if (res.status === 401 && opts.auth && tokenStore.get()) {
    if (await refreshOnce()) {
      res = await doFetch(path, opts, tokenStore.get()?.accessToken)
    }
  }
  if (!res.ok) throw await toApiError(res)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
