import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { refreshOnce } from '@/common/api/http'
import { tokenStore } from '@/common/api/tokenStore'
import { ErrorBox, InfoBox } from '@/common/components/ErrorBox'
import { useAuth } from '../context/auth-context'
import { useMe } from '../hooks/useMe'
import {
  useChangePassword,
  useLogoutAll,
  useResendEmail,
  useWithdraw,
} from '../hooks/mutations'

/** 내 계정: 보호 API 조회(useQuery), 토큰 재발급, 전체 로그아웃, 비밀번호 변경, 탈퇴를 시험할 수 있다. */
export default function MyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const me = useMe()
  const resend = useResendEmail()
  const logoutAll = useLogoutAll()
  const changePassword = useChangePassword()
  const withdraw = useWithdraw()
  const [pw, setPw] = useState({ current: '', next: '' })

  // 개발 확인용: /refresh 를 직접 호출해 리프레시 토큰이 교체되는지 본다
  const manualRefresh = useMutation({
    mutationFn: async () => {
      const before = tokenStore.get()?.refreshToken
      const ok = await refreshOnce()
      const after = tokenStore.get()?.refreshToken
      return ok ? `refresh 성공. 리프레시 토큰 교체됨: ${before !== after}` : 'refresh 실패 (로그아웃됨)'
    },
  })

  const submitPassword = (e: FormEvent) => {
    e.preventDefault()
    changePassword.mutate(
      { currentPassword: pw.current || undefined, newPassword: pw.next },
      { onSuccess: () => setPw({ current: '', next: '' }) },
    )
  }

  const handleWithdraw = () => {
    if (!window.confirm('정말 탈퇴하시겠습니까? (테스트 계정으로만 해 보세요)')) return
    withdraw.mutate(undefined, { onSuccess: () => navigate('/signup') })
  }

  const error =
    me.error ?? resend.error ?? logoutAll.error ?? changePassword.error ?? withdraw.error ?? manualRefresh.error

  return (
    <>
      <h2>내 계정</h2>
      <p>
        {user?.name} ({user?.email}) · role={user?.role} · 이메일 인증: {user?.emailVerified ? '완료' : '미인증'}
      </p>
      {!user?.emailVerified && (
        <div className="box info">
          이메일 인증이 필요합니다.{' '}
          <button disabled={resend.isPending} onClick={() => resend.mutate(user!.email)}>인증 메일 재발송</button>
        </div>
      )}

      <div className="row wrap">
        <button disabled={me.isFetching} onClick={() => me.refetch()}>내 정보 다시 조회 (보호 API)</button>
        <button onClick={() => manualRefresh.mutate()}>토큰 재발급 (/refresh)</button>
        <button onClick={() => logoutAll.mutate(undefined, { onSettled: () => navigate('/login') })}>전체 기기 로그아웃</button>
        <button className="danger" onClick={handleWithdraw}>회원 탈퇴</button>
      </div>

      {me.data && <pre>{JSON.stringify(me.data, null, 2)}</pre>}

      <h3>비밀번호 변경</h3>
      <form onSubmit={submitPassword}>
        <input placeholder="현재 비밀번호 (소셜 전용 계정은 생략)" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
        <input placeholder="새 비밀번호" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required />
        <button type="submit" disabled={changePassword.isPending}>변경</button>
      </form>

      <InfoBox message={manualRefresh.data} />
      <InfoBox message={resend.data?.message} />
      <InfoBox message={changePassword.isSuccess ? '비밀번호 변경 성공. 다른 기기는 로그아웃되고 이 기기는 새 토큰으로 갱신되었습니다.' : null} />
      <ErrorBox error={error} />
    </>
  )
}
