import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { UserRole } from '@/common/types/session'
import { useAuth } from '../context/auth-context'

/**
 * 특정 역할만 볼 수 있는 페이지를 감싼다. 비로그인 → /login, 역할 불일치 → 홈.
 * ※ 화면 편의용이다. 데이터 보호는 서버(@AdminOnly, @HostOrAdmin)가 한다.
 *
 * 사용:  { path: '/host/new', element: <RoleRoute roles={['HOST', 'ADMIN']}><HostPage /></RoleRoute> }
 */
export function RoleRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}
