import type { UserRole } from '@/common/types/session'
import { useAuth } from '../context/auth-context'

/**
 * 현재 사용자가 주어진 역할 중 하나인지. 버튼/메뉴를 보이거나 숨길 때 쓴다.
 *   const canRegister = useHasRole('HOST', 'ADMIN')
 * ※ 화면 편의용이다. 실제 차단은 서버가 한다.
 */
export function useHasRole(...roles: UserRole[]): boolean {
  const { user } = useAuth()
  return !!user && roles.includes(user.role)
}
