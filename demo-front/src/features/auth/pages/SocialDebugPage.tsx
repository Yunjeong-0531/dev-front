import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorBox, InfoBox } from '@/common/components/ErrorBox'
import { TermsAgreement } from '../components/TermsAgreement'
import { useTermsAgreement } from '../hooks/useTermsAgreement'
import { useSocialComplete, useSocialLogin } from '../hooks/mutations'

/**
 * 소셜 SDK 연동 전, 백엔드의 소셜 로그인/가입 플로우만 확인하는 개발용 페이지.
 * 각 제공자(카카오/네이버/구글)의 access token 을 직접 발급받아 붙여 넣는다.
 */
export default function SocialDebugPage() {
  const navigate = useNavigate()
  const { terms, agreed, toggle, toggleAll, requiredOk } = useTermsAgreement()
  const socialLogin = useSocialLogin()
  const complete = useSocialComplete()

  const [provider, setProvider] = useState('kakao')
  const [accessToken, setAccessToken] = useState('')
  const [signup, setSignup] = useState<{ token: string; email?: string } | null>(null)
  const [extra, setExtra] = useState({ email: '', name: '', phone: '' })

  const login = (e: FormEvent) => {
    e.preventDefault()
    socialLogin.mutate(
      { provider, accessToken },
      {
        onSuccess: (res) => {
          if (!res.newUser && res.tokens) {
            navigate('/')
          } else {
            setSignup({ token: res.signupToken!, email: res.email })
            setExtra((x) => ({ ...x, name: res.name ?? '' }))
          }
        },
      },
    )
  }

  const submitComplete = (e: FormEvent) => {
    e.preventDefault()
    if (!signup) return
    complete.mutate(
      {
        signupToken: signup.token,
        email: signup.email ? undefined : extra.email,
        name: extra.name || undefined,
        phone: extra.phone || undefined,
        agreedTermIds: [...agreed],
      },
      { onSuccess: () => navigate('/') },
    )
  }

  return (
    <>
      <h2>소셜 로그인 (토큰 직접 입력)</h2>
      <form onSubmit={login}>
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="kakao">kakao</option>
          <option value="naver">naver</option>
          <option value="google">google</option>
          <option value="apple">apple (미구현 → UNSUPPORTED_PROVIDER 확인용)</option>
        </select>
        <textarea placeholder="provider access token" rows={3} value={accessToken} onChange={(e) => setAccessToken(e.target.value)} required />
        <button type="submit" disabled={socialLogin.isPending}>POST /api/auth/social/{provider}</button>
      </form>

      {signup && (
        <form onSubmit={submitComplete}>
          <h3>가입 완료 (/social/complete)</h3>
          <InfoBox message="신규 회원입니다. 약관 동의 후 가입을 완료하세요." />
          {signup.email ? (
            <p>소셜 이메일: {signup.email}</p>
          ) : (
            <input placeholder="이메일 (소셜에서 못 받음 → 직접 입력)" type="email" value={extra.email} onChange={(e) => setExtra({ ...extra, email: e.target.value })} required />
          )}
          <input placeholder="이름" value={extra.name} onChange={(e) => setExtra({ ...extra, name: e.target.value })} />
          <input placeholder="휴대폰 (선택)" value={extra.phone} onChange={(e) => setExtra({ ...extra, phone: e.target.value })} />
          <TermsAgreement terms={terms} agreed={agreed} onToggle={toggle} onToggleAll={toggleAll} />
          <button type="submit" disabled={!requiredOk || complete.isPending}>가입 완료</button>
        </form>
      )}

      <ErrorBox error={socialLogin.error ?? complete.error} />
    </>
  )
}
