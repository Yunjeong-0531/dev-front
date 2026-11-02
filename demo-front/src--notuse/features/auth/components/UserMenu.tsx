import { useNavigate } from 'react-router-dom'
import { useLogout } from '../hooks/mutations'
import { useAuth } from '../context/auth-context'

/** 상단 우측 사용자 영역 (이메일 + 로그아웃) */
export function UserMenu() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const logout = useLogout()

  if (!user) return null
  return (
    <>
      {user.email}{' '}
      <button
        disabled={logout.isPending}
        onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/login') })}
      >
        로그아웃
      </button>
    </>
  )
}
