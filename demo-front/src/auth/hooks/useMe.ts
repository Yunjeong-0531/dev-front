import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api/user'
import { useAuth } from '../context/auth-context'
import { authKeys } from './queryKeys'

/** GET /api/users/me. 로그인 상태에서만 조회한다. */
export function useMe() {
  const { user } = useAuth()
  return useQuery({
    queryKey: authKeys.me(user?.id),
    queryFn: userApi.me,
    enabled: !!user,
  })
}
