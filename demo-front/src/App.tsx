import { Navigate, useRoutes } from 'react-router-dom'
import { Layout } from '@/common/components/Layout'
import { NotFound } from '@/common/components/NotFound'
import { AuthNav } from '@/auth/components/AuthNav'
import { UserMenu } from '@/auth/components/UserMenu'
import { authRoutes } from '@/auth/routes'
import { AccommodationNav } from '@/accommodation/components/AccommodationNav'
import { accommodationRoutes } from '@/accommodation/routes'
import { mainRoutes } from '@/mainPage/routes'

/**
 * 조립(composition) 지점. feature 들은 각자 routes / Nav 를 export 하고, 여기서만 합친다.
 * 새 feature 를 추가할 때 이 파일에 3줄(import 2 + 라우트/메뉴 1)만 추가하면 된다.
 */
export default function App() {
  return useRoutes([
    {
      element: (
        <Layout
          nav={
            <>
              <AccommodationNav />
              <AuthNav />
            </>
          }
          actions={<UserMenu />}
        />
      ),
      children: [
        // 숙소 목록이 홈이 되면 여기를 /accommodations 로 바꾸세요
        { index: true, element: <Navigate to="/main" replace /> },
        ...authRoutes,
        ...accommodationRoutes,
        ...mainRoutes,
        { path: '*', element: <NotFound /> },
      ],
    },
  ])
}
