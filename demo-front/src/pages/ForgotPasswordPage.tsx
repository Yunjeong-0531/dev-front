import { useState } from 'react'
import type { FormEvent } from 'react'
import { authApi } from '../api/auth'
import { ErrorBox, InfoBox } from '../components/ErrorBox'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<unknown>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    try {
      setMessage((await authApi.forgotPassword(email)).message)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <>
      <h2>비밀번호 재설정 메일 요청</h2>
      <form onSubmit={submit}>
        <input placeholder="가입한 이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">메일 받기</button>
      </form>
      <InfoBox message={message} />
      <ErrorBox error={error} />
    </>
  )
}
