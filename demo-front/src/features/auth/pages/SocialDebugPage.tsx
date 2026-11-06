import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorBox } from '@/common/components/ErrorBox'
import { useSocialLogin } from '../hooks/mutations'
import type { SocialSignupState } from '../types'

/**
 * [개발 전용] 제공자 콘솔 설정 없이 백엔드 소셜 플로우만 확인하는 화면.
 * 제공자 액세스 토큰을 직접 붙여 넣는다. 백엔드 app.auth.social.allow-access-token=true 일 때만 동작한다.
 * 신규 회원이면 실제 가입 마무리 화면(/signup/social)으로 이동한다.
 */
export default function SocialDebugPage() {
  const navigate = useNavigate()
  const login = useSocialLogin()
  const [provider, setProvider] = useState('kakao')
  const [accessToken, setAccessToken] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    login.mutate(
      { provider, body: { accessToken } },
      {
        onSuccess: (res) => {
          if (res.newUser && res.signupToken) {
            const state: SocialSignupState = { signupToken: res.signupToken, email: res.email, name: res.name }
            navigate('/signup/social', { state })
          } else {
            navigate('/')
          }
        },
      },
    )
  }

  return (
    <>
      <h2>소셜 로그인 (토큰 직접 입력 · 개발용)</h2>
      <form onSubmit={submit}>
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="kakao">kakao</option>
          <option value="naver">naver</option>
          <option value="google">google</option>
          <option value="apple">apple (미구현 → UNSUPPORTED_PROVIDER 확인용)</option>
        </select>
        <textarea placeholder="provider access token" rows={3} value={accessToken} onChange={(e) => setAccessToken(e.target.value)} required />
        <button type="submit" disabled={login.isPending}>POST /api/auth/social/{provider}</button>
      </form>
      <ErrorBox error={login.error} />
    </>
  )
}
