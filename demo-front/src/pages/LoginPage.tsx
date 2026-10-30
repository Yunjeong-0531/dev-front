import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorBox } from '../components/ErrorBox'
import { useAuth } from '../context/auth-context'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<unknown>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err)
    }
  }

  return (
    <>
      <h2>로그인</h2>
      <form onSubmit={submit}>
        <input placeholder="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">로그인</button>
      </form>
      <ErrorBox error={error} />
      <p>
        <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
      </p>
    </>
  )
}
