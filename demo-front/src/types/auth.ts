// 백엔드 DTO 와 1:1 대응

export type UserRole = 'GUEST' | 'HOST' | 'ADMIN'
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'

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

export interface ErrorResponse {
  code: string
  message: string
  fieldErrors?: Record<string, string>
}

export interface Term {
  id: number
  type: string
  version: string
  title: string
  content: string
  required: boolean
  displayOrder: number
}

export interface SignupRequest {
  email: string
  password: string
  name: string
  phone?: string
  agreedTermIds: number[]
}

export interface SignupResponse {
  userId: number
  email: string
  status: UserStatus
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SocialLoginResponse {
  newUser: boolean
  tokens?: TokenResponse
  signupToken?: string
  email?: string
  name?: string
}

export interface SocialCompleteRequest {
  signupToken: string
  email?: string
  name?: string
  phone?: string
  agreedTermIds: number[]
}

export interface ChangePasswordRequest {
  currentPassword?: string
  newPassword: string
}

export interface MessageResponse {
  message: string
}
