import { useState } from 'react'
import type { FormEvent } from 'react'
import { authApi } from '../api/auth'
import { ErrorBox, InfoBox } from '../components/ErrorBox'

export default function ResendEmailPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<unknown>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    try {
      setMessage((await authApi.resendEmail(email)).message)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <>
      <h2>인증 메일 재발송</h2>
      <form onSubmit={submit}>
        <input placeholder="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">재발송</button>
      </form>
      <InfoBox message={message} />
      <ErrorBox error={error} />
    </>
  )
}
