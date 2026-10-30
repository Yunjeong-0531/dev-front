import { useMutation } from '@tanstack/react-query'
import { tokenStore } from '@/common/api/tokenStore'
import { authApi } from '../api/auth'
import { userApi } from '../api/user'

/**
 * 규칙
 *  - "토큰 저장/삭제" 같은 상태 변경은 여기(훅의 onSuccess)에서 처리한다.
 *  - 화면 이동/메시지는 페이지에서 mutate(vars, { onSuccess }) 로 처리한다.
 *    (훅 onSuccess → 페이지 onSuccess 순서로 실행됨)
 */

export const useSignup = () => useMutation({ mutationFn: authApi.signup })

export const useCheckEmail = () => useMutation({ mutationFn: authApi.checkEmail })

export const useLogin = () =>
  useMutation({
    mutationFn: authApi.login,
    onSuccess: (tokens) => tokenStore.set(tokens),
  })

/** 서버 호출이 실패해도 클라이언트는 로그아웃 처리한다. */
export const useLogout = () =>
  useMutation({
    mutationFn: async () => {
      const current = tokenStore.get()
      try {
        if (current) await authApi.logout(current.refreshToken)
      } finally {
        tokenStore.clear()
      }
    },
  })

export const useLogoutAll = () =>
  useMutation({
    mutationFn: async () => {
      try {
        await authApi.logoutAll()
      } finally {
        tokenStore.clear()
      }
    },
  })

export const useVerifyEmail = () => useMutation({ mutationFn: authApi.verifyEmail })

export const useResendEmail = () => useMutation({ mutationFn: authApi.resendEmail })

export const useForgotPassword = () => useMutation({ mutationFn: authApi.forgotPassword })

export const useResetPassword = () =>
  useMutation({
    mutationFn: (v: { token: string; newPassword: string }) =>
      authApi.resetPassword(v.token, v.newPassword),
  })

export const useSocialLogin = () =>
  useMutation({
    mutationFn: (v: { provider: string; accessToken: string }) =>
      authApi.socialLogin(v.provider, v.accessToken),
    onSuccess: (res) => {
      if (!res.newUser && res.tokens) tokenStore.set(res.tokens)
    },
  })

export const useSocialComplete = () =>
  useMutation({
    mutationFn: authApi.socialComplete,
    onSuccess: (tokens) => tokenStore.set(tokens),
  })

/** 비밀번호 변경: 다른 기기는 로그아웃되고, 이 기기는 응답의 새 토큰으로 교체 */
export const useChangePassword = () =>
  useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: (tokens) => tokenStore.set(tokens),
  })

export const useWithdraw = () =>
  useMutation({
    mutationFn: userApi.withdraw,
    onSuccess: () => tokenStore.clear(),
  })
