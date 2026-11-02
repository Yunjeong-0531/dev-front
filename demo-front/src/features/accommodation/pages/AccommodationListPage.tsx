import { StayBoard } from '../components/StayBoard'
import styles from './AccommodationListPage.module.css'

/**
 * 숙소 담당자용 시작점. 지금은 목데이터 보드를 그대로 보여준다. 자유롭게 교체하세요.
 *
 * 공용으로 가져다 쓰는 것:
 *   import { request } from '@/common/api/http'                  // 토큰 자동 갱신 포함 HTTP 클라이언트
 *   import { ErrorBox } from '@/common/components/ErrorBox'       // 백엔드 에러 표시
 *   import { useAuth, ProtectedRoute } from '@/features/auth/public'   // 로그인 정보 / 로그인 필요 라우트
 *
 * 조회 예시 (TanStack Query):
 *   const q = useQuery({
 *     queryKey: ['accommodation', 'list', params],     // 'accommodation' 으로 시작 (키 충돌 방지)
 *     queryFn: () => request<Page<Accommodation>>(`/accommodations?...`),
 *   })
 *
 * 주의: 백엔드 SecurityConfig 의 permitAll 에 '/api/accommodations/**' 를 추가해야 비로그인 조회가 된다.
 */
export default function AccommodationListPage() {
  return (
    <div className={styles.page}>
      <StayBoard />
    </div>
  )
}
