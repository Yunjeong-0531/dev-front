import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { refreshOnce, tokenStore } from '../api/http'
import { userApi } from '../api/user'
import { ErrorBox, InfoBox } from '../components/ErrorBox'
import { useAuth } from '../context/auth-context'
import type { UserSummary } from '../types/auth'

/** 로그인 후 화면: 보호된 API 호출, 토큰 재발급, 전체 로그아웃, 비밀번호 변경, 탈퇴를 시험해 볼 수 있다. */
export default function HomePage() {
  const { user, applyTokens, logoutAll } = useAuth()
  const navigate = useNavigate()
  const [me, setMe] = useState<UserSummary | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [pw, setPw] = useState({ current: '', next: '' })

  const run = async (fn: () => Promise<void>) => {
    setError(null)
    setMessage(null)
    try {
      await fn()
    } catch (e) {
      setError(e)
    }
  }

  const fetchMe = () =>
    run(async () => {
      setMe(await userApi.me())
      setMessage('GET /api/users/me 성공 (액세스 토큰 만료 시 자동 refresh 후 재시도)')
    })

  const manualRefresh = () =>
    run(async () => {
      const before = tokenStore.get()?.refreshToken
      const ok = await refreshOnce()
      const after = tokenStore.get()?.refreshToken
      setMessage(ok ? `refresh 성공. 리프레시 토큰 교체됨: ${before !== after}` : 'refresh 실패 (로그아웃됨)')
    })

  const handleLogoutAll = () =>
    run(async () => {
      await logoutAll()
      navigate('/login')
    })

  const changePassword = (e: FormEvent) => {
    e.preventDefault()
    return run(async () => {
      applyTokens(await userApi.changePassword({ currentPassword: pw.current || undefined, newPassword: pw.next }))
      setPw({ current: '', next: '' })
      setMessage('비밀번호 변경 성공. 다른 기기는 로그아웃되고 이 기기는 새 토큰으로 갱신되었습니다.')
    })
  }

  const withdraw = () =>
    run(async () => {
      if (!window.confirm('정말 탈퇴하시겠습니까? (테스트 계정으로만 해 보세요)')) return
      await userApi.withdraw()
      tokenStore.clear()
      navigate('/signup')
    })

  const resend = () =>
    run(async () => setMessage((await authApi.resendEmail(user!.email)).message))

  return (
    <>
      <h2>홈</h2>
      <p>
        {user?.name} ({user?.email}) · role={user?.role} · 이메일 인증: {user?.emailVerified ? '완료' : '미인증'}
      </p>
      {!user?.emailVerified && (
        <div className="box info">
          이메일 인증이 필요합니다. <button onClick={resend}>인증 메일 재발송</button>
        </div>
      )}

      <div className="row wrap">
        <button onClick={fetchMe}>내 정보 조회 (보호 API)</button>
        <button onClick={manualRefresh}>토큰 재발급 (/refresh)</button>
        <button onClick={handleLogoutAll}>전체 기기 로그아웃</button>
        <button onClick={withdraw} className="danger">회원 탈퇴</button>
      </div>

      {me && <pre>{JSON.stringify(me, null, 2)}</pre>}

      <h3>비밀번호 변경</h3>
      <form onSubmit={changePassword}>
        <input placeholder="현재 비밀번호 (소셜 전용 계정은 생략)" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
        <input placeholder="새 비밀번호" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required />
        <button type="submit">변경</button>
      </form>

      <InfoBox message={message} />
      <ErrorBox error={error} />
    </>
  )
}
