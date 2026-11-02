import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBox, InfoBox } from '@/common/components/ErrorBox'
import { TermsAgreement } from '../components/TermsAgreement'
import { useTermsAgreement } from '../hooks/useTermsAgreement'
import { useCheckEmail, useSignup } from '../hooks/mutations'

export default function SignupPage() {
  const { terms, agreed, toggle, toggleAll, requiredOk, error: termsError } = useTermsAgreement()
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })
  const signup = useSignup()
  const checkEmail = useCheckEmail()

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    signup.mutate({
      email: form.email,
      password: form.password,
      name: form.name,
      phone: form.phone || undefined,
      agreedTermIds: [...agreed],
    })
  }

  const emailMessage = checkEmail.data
    ? checkEmail.data.available
      ? '사용 가능한 이메일입니다.'
      : '이미 사용 중인 이메일입니다.'
    : null

  return (
    <>
      <h2>회원가입</h2>
      <form onSubmit={submit}>
        <div className="row">
          <input placeholder="이메일" type="email" value={form.email} onChange={set('email')} required />
          <button type="button" disabled={!form.email || checkEmail.isPending} onClick={() => checkEmail.mutate(form.email)}>
            중복 확인
          </button>
        </div>
        <InfoBox message={emailMessage} />
        <input placeholder="비밀번호 (영문+숫자 8~64자)" type="password" value={form.password} onChange={set('password')} required />
        <input placeholder="이름" value={form.name} onChange={set('name')} required />
        <input placeholder="휴대폰 (선택, 010-1234-5678)" value={form.phone} onChange={set('phone')} />
        <TermsAgreement terms={terms} agreed={agreed} onToggle={toggle} onToggleAll={toggleAll} />
        <button type="submit" disabled={!requiredOk || signup.isPending}>가입하기</button>
      </form>

      <ErrorBox error={signup.error ?? checkEmail.error ?? termsError} />
      {signup.data && (
        <>
          <InfoBox message={`가입 완료 (userId=${signup.data.userId}, status=${signup.data.status}). 메일함에서 인증 링크를 확인하세요.`} />
          <p><Link to="/login">로그인하러 가기</Link></p>
        </>
      )}
    </>
  )
}
