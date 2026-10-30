import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ErrorBox, InfoBox } from '@/common/components/ErrorBox'
import { useResetPassword } from '../hooks/mutations'

/** 메일 링크(/reset-password?token=...) */
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState('')
  const reset = useResetPassword()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    reset.mutate({ token, newPassword: password })
  }

  return (
    <>
      <h2>새 비밀번호 설정</h2>
      {!token && <div className="box error">token 파라미터가 없습니다.</div>}
      <form onSubmit={submit}>
        <input placeholder="새 비밀번호 (영문+숫자 8~64자)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={!token || reset.isPending}>변경</button>
      </form>
      <InfoBox message={reset.isSuccess ? '비밀번호가 변경되었습니다. 모든 기기에서 로그아웃되었으니 다시 로그인해 주세요.' : null} />
      <ErrorBox error={reset.error} />
      {reset.isSuccess && <p><Link to="/login">로그인</Link></p>}
    </>
  )
}
