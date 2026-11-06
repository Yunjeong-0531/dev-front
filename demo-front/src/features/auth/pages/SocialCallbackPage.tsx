import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ErrorBox } from '@/common/components/ErrorBox'
import { useSocialLogin } from '../hooks/mutations'
import { consumeSocialState, isSocialProviderId, redirectUriFor } from '../social/providers'
import type { SocialSignupState } from '../types'

/**
 * 제공자 로그인 후 돌아오는 페이지: /auth/callback/:provider?code=…&state=…
 *  - 인가 코드는 "한 번만" 쓸 수 있다. 개발 모드(StrictMode)에서 effect 가 두 번 실행되어도 한 번만 보내도록 ref 로 막는다.
 *  - 기존 회원: 토큰 저장(훅) 후 홈으로 / 신규 회원: 약관 동의 화면(/signup/social)으로
 */
export default function SocialCallbackPage() {
  const { provider } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { mutate, data, error, isPending } = useSocialLogin()
  const called = useRef(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const code = params.get('code')
    const state = params.get('state')
    const providerError = params.get('error')

    if (providerError) {
      setLocalError(providerError === 'access_denied' ? '소셜 로그인을 취소했습니다.' : `소셜 로그인 오류: ${providerError}`)
      return
    }
    if (!isSocialProviderId(provider) || !code || !state) {
      setLocalError('잘못된 접근입니다.')
      return
    }
    if (!consumeSocialState(provider, state)) {
      setLocalError('유효하지 않은 요청입니다. 처음부터 다시 시도해 주세요.')
      return
    }
    mutate({ provider, body: { code, state, redirectUri: redirectUriFor(provider) } })
  }, [provider, params, mutate])

  // 결과에 따른 이동 (mutate 콜백 대신 effect 로 처리: 개발 모드 재마운트에도 안전)
  useEffect(() => {
    if (!data) return
    if (data.newUser && data.signupToken) {
      const state: SocialSignupState = { signupToken: data.signupToken, email: data.email, name: data.name }
      navigate('/signup/social', { replace: true, state })
    } else {
      navigate('/', { replace: true })
    }
  }, [data, navigate])

  return (
    <>
      <h2>소셜 로그인</h2>
      {isPending && <p>로그인 처리 중...</p>}
      {localError && <div className="box error">{localError}</div>}
      <ErrorBox error={error} />
      {(localError || error) && (
        <p>
          <Link to="/login">로그인 화면으로 돌아가기</Link>
        </p>
      )}
    </>
  )
}
