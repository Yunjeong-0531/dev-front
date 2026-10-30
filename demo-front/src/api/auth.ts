import { request } from './http'
import type {
  LoginRequest,
  MessageResponse,
  SignupRequest,
  SignupResponse,
  SocialCompleteRequest,
  SocialLoginResponse,
  Term,
  TokenResponse,
} from '../types/auth'

export const authApi = {
  signup: (body: SignupRequest) =>
    request<SignupResponse>('/auth/signup', { method: 'POST', body }),

  checkEmail: (email: string) =>
    request<{ available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`),

  login: (body: LoginRequest) =>
    request<TokenResponse>('/auth/login', { method: 'POST', body }),

  logout: (refreshToken: string) =>
    request<void>('/auth/logout', { method: 'POST', body: { refreshToken } }),

  logoutAll: () => request<void>('/auth/logout-all', { method: 'POST', auth: true }),

  verifyEmail: (token: string) =>
    request<void>('/auth/email/verify', { method: 'POST', body: { token } }),

  resendEmail: (email: string) =>
    request<MessageResponse>('/auth/email/resend', { method: 'POST', body: { email } }),

  forgotPassword: (email: string) =>
    request<MessageResponse>('/auth/password/forgot', { method: 'POST', body: { email } }),

  resetPassword: (token: string, newPassword: string) =>
    request<void>('/auth/password/reset', { method: 'POST', body: { token, newPassword } }),

  socialLogin: (provider: string, accessToken: string) =>
    request<SocialLoginResponse>(`/auth/social/${provider}`, { method: 'POST', body: { accessToken } }),

  socialComplete: (body: SocialCompleteRequest) =>
    request<TokenResponse>('/auth/social/complete', { method: 'POST', body }),
}

export const termsApi = {
  list: () => request<Term[]>('/terms'),
}
