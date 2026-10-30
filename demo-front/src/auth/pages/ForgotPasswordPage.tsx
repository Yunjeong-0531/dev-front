import { useState } from 'react'
import type { FormEvent } from 'react'
import { ErrorBox, InfoBox } from '@/common/components/ErrorBox'
import { useForgotPassword } from '../hooks/mutations'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const forgot = useForgotPassword()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    forgot.mutate(email)
  }

  return (
    <>
      <h2>비밀번호 재설정 메일 요청</h2>
      <form onSubmit={submit}>
        <input placeholder="가입한 이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" disabled={forgot.isPending}>메일 받기</button>
      </form>
      <InfoBox message={forgot.data?.message} />
      <ErrorBox error={forgot.error} />
    </>
  )
}
