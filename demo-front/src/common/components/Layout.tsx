import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Footer } from './layout/Footer'
import { Header } from './layout/Header'
import type { HeaderMenu } from './layout/Header'
import { ReservationTab } from './layout/ReservationTab'
import { ScrollToHash } from './layout/ScrollToHash'

interface Props {
  menus: HeaderMenu[]
  util?: ReactNode
}

/** 사이트 공통 틀: 고정 헤더 + 예약 탭 + 본문(Outlet) + 푸터. common 은 feature 를 import 하지 않는다. */
export function Layout({ menus, util }: Props) {
  return (
    <>
      <ScrollToHash />
      <Header menus={menus} util={util} />
      <ReservationTab />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
