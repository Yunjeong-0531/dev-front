import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorBox } from '@/common/components/ErrorBox'
import { useLogin } from '../hooks/mutations'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    login.mutate({ email, password }, { onSuccess: () => navigate('/') })
  }

  return (
    <>
      <h2>로그인</h2>
      <form onSubmit={submit}>
        <input placeholder="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={login.isPending}>로그인</button>
      </form>
      <ErrorBox error={login.error} />
      <p>
        <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
      </p>
    </>
  )
}
