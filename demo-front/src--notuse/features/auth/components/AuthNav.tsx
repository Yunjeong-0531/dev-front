import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

/** auth 담당 메뉴. App.tsx 가 Layout 의 nav 로 조립한다. */
export function AuthNav() {
  const { user } = useAuth()
  return (
    <>
      {!user && <Link to="/login">로그인</Link>}
      {!user && <Link to="/signup">회원가입</Link>}
      {user && <Link to="/me">내 계정</Link>}
      <Link to="/forgot-password">비밀번호 찾기</Link>
      <Link to="/resend-email">인증메일 재발송</Link>
      {import.meta.env.DEV && <Link to="/social-debug">소셜(토큰 직접 입력)</Link>}
    </>
  )
}
