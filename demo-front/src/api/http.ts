import type { ErrorResponse, TokenResponse } from '../types/auth'

const BASE = '/api'
const STORAGE_KEY = 'stay.auth'

// ------------------------------------------------------------------
// 토큰 저장소
// 연동 확인용으로 localStorage 를 사용한다. 운영에서는 리프레시 토큰을
// HttpOnly 쿠키로 옮기는 것을 권장 (XSS 로 토큰이 털리는 것 방지).
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// 에러
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// 요청 + 401 시 자동 refresh (동시에 여러 요청이 401 이어도 refresh 는 한 번만)
//   → 백엔드는 refresh 토큰 rotation + 재사용 감지를 하므로 refresh 를 동시에 여러 번 보내면 안 된다.
// ------------------------------------------------------------------
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  /** true 면 Authorization 헤더를 붙이고, 401 시 refresh 후 1회 재시도 */
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
