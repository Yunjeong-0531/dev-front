import { request } from '@/common/api/http'
import type { TokenResponse, UserSummary } from '@/common/types/session'
import type { ChangePasswordRequest } from '../types'

export const userApi = {
  me: () => request<UserSummary>('/users/me', { auth: true }),

  changePassword: (body: ChangePasswordRequest) =>
    request<TokenResponse>('/users/me/password', { method: 'PATCH', body, auth: true }),

  withdraw: () => request<void>('/users/me', { method: 'DELETE', auth: true }),
}
