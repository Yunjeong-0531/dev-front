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
/**
 * 소셜 로그인 요청. 둘 중 하나:
 * - 인가 코드 방식(권장): code + redirectUri + state
 * - 액세스 토큰 방식(개발용): accessToken 
 * (백엔드 app.auth.social.allow-access-token=true 일 때만)
 */
export interface SocialLoginRequest {
  accessToken?: string
  code?: string
  redirectUri?: string
  state?: string
}
/** 신규 소셜 회원이 약관 동의 화면(/signup/social)으로 넘어올 때 
 * router state로 전달하는 값*/

export interface SocialSignupState {
  signupToken : string
  email?: string
  name?: string
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
