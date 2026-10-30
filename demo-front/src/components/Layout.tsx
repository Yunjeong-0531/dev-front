import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="container">
      <nav>
        <Link to="/">홈</Link>
        {!user && <Link to="/login">로그인</Link>}
        {!user && <Link to="/signup">회원가입</Link>}
        <Link to="/forgot-password">비밀번호 찾기</Link>
        <Link to="/resend-email">인증메일 재발송</Link>
        <Link to="/social-debug">소셜(토큰 직접 입력)</Link>
        {user && (
          <span className="right">
            {user.email} <button onClick={handleLogout}>로그아웃</button>
          </span>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
