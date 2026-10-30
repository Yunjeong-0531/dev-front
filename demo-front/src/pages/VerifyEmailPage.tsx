import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/auth'
import { ErrorBox, InfoBox } from '../components/ErrorBox'

/** 메일 링크(/verify-email?token=...)로 진입 → 여기서 POST /api/auth/email/verify 호출 */
export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<unknown>(null)
  const called = useRef(false) // StrictMode(개발)에서 effect 가 두 번 실행되어 토큰이 소모되는 것 방지

  useEffect(() => {
    if (!token || called.current) return
    called.current = true
    authApi
      .verifyEmail(token)
      .then(() => setMessage('이메일 인증이 완료되었습니다.'))
      .catch(setError)
  }, [token])

  return (
    <>
      <h2>이메일 인증</h2>
      {!token && <div className="box error">token 파라미터가 없습니다.</div>}
      {token && !message && !error && <p>인증 중...</p>}
      <InfoBox message={message} />
      <ErrorBox error={error} />
      <p>
        <Link to="/">홈으로</Link> · <Link to="/resend-email">인증 메일 재발송</Link>
      </p>
    </>
  )
}
