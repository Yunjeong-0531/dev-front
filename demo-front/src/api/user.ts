import { request } from './http'
import type { ChangePasswordRequest, TokenResponse, UserSummary } from '../types/auth'

export const userApi = {
  me: () => request<UserSummary>('/users/me', { auth: true }),

  changePassword: (body: ChangePasswordRequest) =>
    request<TokenResponse>('/users/me/password', { method: 'PATCH', body, auth: true }),

  withdraw: () => request<void>('/users/me', { method: 'DELETE', auth: true }),
}
