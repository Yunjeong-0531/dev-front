import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { useLogout } from '../hooks/mutations'

/** 헤더 우측 영역의 인증 메뉴. App.tsx 가 Layout 의 util 로 넘겨 조립한다. */
export function AuthUtil() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const logout = useLogout()

  if (!user) {
    return (
      <>
        <Link to="/login">LOGIN</Link>
        <Link to="/signup">JOIN</Link>
      </>
    )
  }
  return (
    <>
      <Link to="/me">MY</Link>
      <button
        disabled={logout.isPending}
        onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/') })}
      >
        LOGOUT
      </button>
    </>
  )
}
