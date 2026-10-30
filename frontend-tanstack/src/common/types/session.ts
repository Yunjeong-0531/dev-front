// http.ts 가 토큰 재발급(/auth/refresh) 응답 형식을 알아야 하므로 common 에 둔다.

export type UserRole = 'GUEST' | 'HOST' | 'ADMIN'

export interface UserSummary {
  id: number
  email: string
  name: string
  role: UserRole
  emailVerified: boolean
}

export interface TokenResponse {
  tokenType: string
  accessToken: string
  accessTokenExpiresIn: number
  refreshToken: string
  refreshTokenExpiresIn: number
  user: UserSummary
}
