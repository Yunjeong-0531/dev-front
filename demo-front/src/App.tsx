import { useRoutes } from 'react-router-dom'
import { Layout } from '@/common/components/Layout'
import type { HeaderMenu } from '@/common/components/layout/Header'
import { NotFound } from '@/common/components/NotFound'
import { AuthUtil } from '@/features/auth/components/AuthUtil'
import { authRoutes } from '@/features/auth/routes'
import { accommodationRoutes } from '@/features/accommodation/routes'
import { homeRoutes } from '@/features/home/routes'

/** 헤더 가운데 메뉴. '/#id' 는 홈 화면의 해당 섹션으로 이동한다. */
const headerMenus: HeaderMenu[] = [
  { label: 'BRAND', to: '/#about' },
  { label: 'STAYS', to: '/#stays' },
  { label: 'CONTACT', to: '/#contact' },
]

/**
 * 조립(composition) 지점. feature 들은 각자 routes / 메뉴 컴포넌트를 export 하고, 여기서만 합친다.
 * 새 feature 를 추가할 때 이 파일에 import 1~2줄 + 라우트 한 줄만 추가하면 된다.
 */
export default function App() {
  return useRoutes([
    {
      element: <Layout menus={headerMenus} util={<AuthUtil />} />,
      children: [
        ...homeRoutes,
        ...authRoutes,
        ...accommodationRoutes,
        { path: '*', element: <NotFound /> },
      ],
    },
  ])
}
