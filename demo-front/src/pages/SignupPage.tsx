import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/auth'
import { ErrorBox, InfoBox } from '../components/ErrorBox'
import { TermsAgreement } from '../components/TermsAgreement'
import { useTerms } from '../hooks/useTerms'

export default function SignupPage() {
  const { terms, agreed, toggle, toggleAll, requiredOk, error: termsError } = useTerms()
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })
  const [emailCheck, setEmailCheck] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState<unknown>(null)

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const checkEmail = async () => {
    setError(null)
    try {
      const { available } = await authApi.checkEmail(form.email)
      setEmailCheck(available ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.')
    } catch (e) {
      setError(e)
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await authApi.signup({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone || undefined,
        agreedTermIds: [...agreed],
      })
      setDone(`가입 완료 (userId=${res.userId}, status=${res.status}). 메일함에서 인증 링크를 확인하세요.`)
    } catch (e) {
      setError(e)
    }
  }

  return (
    <>
      <h2>회원가입</h2>
      <form onSubmit={submit}>
        <div className="row">
          <input placeholder="이메일" type="email" value={form.email} onChange={set('email')} required />
          <button type="button" onClick={checkEmail}>중복 확인</button>
        </div>
        <InfoBox message={emailCheck} />
        <input placeholder="비밀번호 (영문+숫자 8~64자)" type="password" value={form.password} onChange={set('password')} required />
        <input placeholder="이름" value={form.name} onChange={set('name')} required />
        <input placeholder="휴대폰 (선택, 010-1234-5678)" value={form.phone} onChange={set('phone')} />
        <TermsAgreement terms={terms} agreed={agreed} onToggle={toggle} onToggleAll={toggleAll} />
        <ErrorBox error={termsError} />
        <button type="submit" disabled={!requiredOk}>가입하기</button>
      </form>
      <ErrorBox error={error} />
      <InfoBox message={done} />
      {done && <p><Link to="/login">로그인하러 가기</Link></p>}
    </>
  )
}
