import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  /** 상단 메뉴 링크들. 각 feature 가 자기 메뉴 컴포넌트를 만들어 App.tsx 에서 조립한다. */
  nav?: ReactNode
  /** 상단 우측 영역 (사용자 메뉴 등) */
  actions?: ReactNode
}

/** common 은 feature(auth 등)를 import 하지 않는다. 필요한 것은 props 로 받는다. */
export function Layout({ nav, actions }: Props) {
  return (
    <div className="container">
      <nav>
        {nav}
        {actions && <span className="right">{actions}</span>}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
