import type { TokenResponse } from '@/common/types/session'

export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'

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
