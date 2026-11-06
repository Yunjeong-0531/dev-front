import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ErrorBox, InfoBox } from '@/common/components/ErrorBox'
import { TermsAgreement } from '../components/TermsAgreement'
import { useSocialComplete } from '../hooks/mutations'
import { useTermsAgreement } from '../hooks/useTermsAgreement'
import type { SocialSignupState } from '../types'

/**
 * 신규 소셜 회원의 가입 마무리 (/signup/social).
 * 콜백 페이지가 router state 로 signupToken 을 넘겨준다. (직접 접근하거나 만료되면 로그인으로)
 */
export default function SocialSignupPage() {
  const navigate = useNavigate()
  const info = useLocation().state as SocialSignupState | null
  const { terms, agreed, toggle, toggleAll, requiredOk, error: termsError } = useTermsAgreement()
  const complete = useSocialComplete()
  const [extra, setExtra] = useState({ email: '', name: info?.name ?? '', phone: '' })

  if (!info?.signupToken) return <Navigate to="/login" replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    complete.mutate(
      {
        signupToken: info.signupToken,
        email: info.email ? undefined : extra.email, // 소셜에서 이메일을 못 받은 경우에만 직접 입력
        name: extra.name || undefined,
        phone: extra.phone || undefined,
        agreedTermIds: [...agreed],
      },
      { onSuccess: () => navigate('/', { replace: true }) },
    )
  }

  return (
    <>
      <h2>가입 마무리</h2>
      <InfoBox message="약관에 동의하면 소셜 계정으로 가입이 완료됩니다." />
      <form onSubmit={submit}>
        {info.email ? (
          <p>가입 이메일: {info.email}</p>
        ) : (
          <input
            placeholder="이메일 (소셜 계정에서 받지 못했어요)"
            type="email"
            value={extra.email}
            onChange={(e) => setExtra({ ...extra, email: e.target.value })}
            required
          />
        )}
        <input placeholder="이름" value={extra.name} onChange={(e) => setExtra({ ...extra, name: e.target.value })} />
        <input placeholder="휴대폰 (선택)" value={extra.phone} onChange={(e) => setExtra({ ...extra, phone: e.target.value })} />
        <TermsAgreement terms={terms} agreed={agreed} onToggle={toggle} onToggleAll={toggleAll} />
        <button type="submit" disabled={!requiredOk || complete.isPending}>가입 완료</button>
      </form>
      <ErrorBox error={complete.error ?? termsError} />
      {complete.error && <p><Link to="/login">처음부터 다시 시도</Link></p>}
    </>
  )
}
