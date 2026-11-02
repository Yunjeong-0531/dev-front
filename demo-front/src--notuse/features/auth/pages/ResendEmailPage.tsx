import { useState } from 'react'
import type { FormEvent } from 'react'
import { ErrorBox, InfoBox } from '@/common/components/ErrorBox'
import { useResendEmail } from '../hooks/mutations'

export default function ResendEmailPage() {
  const [email, setEmail] = useState('')
  const resend = useResendEmail()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    resend.mutate(email)
  }

  return (
    <>
      <h2>인증 메일 재발송</h2>
      <form onSubmit={submit}>
        <input placeholder="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" disabled={resend.isPending}>재발송</button>
      </form>
      <InfoBox message={resend.data?.message} />
      <ErrorBox error={resend.error} />
    </>
  )
}
