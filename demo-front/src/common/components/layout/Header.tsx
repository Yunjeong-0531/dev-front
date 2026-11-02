import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export interface HeaderMenu {
  label: string
  /** 예: '/#stays' (홈의 해당 섹션으로 이동). 다른 페이지에서 눌러도 홈으로 가서 스크롤된다. */
  to: string
}

interface Props {
  menus: HeaderMenu[]
  /** 우측 영역(로그인/MY 등). common 은 feature 를 모르므로 App.tsx 가 채워 넣는다. */
  util?: ReactNode
}

export function Header({ menus, util }: Props) {
  // 스크롤을 내렸는지 기억하는 상태
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // 스크롤할 때마다 40px 넘게 내려왔는지 확인
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    // 화면에서 사라질 때 감시를 해제 (정리 작업)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? `${styles.header} ${styles.scrolled}` : styles.header}>
      <Link to="/#top" className={styles.brand}>GREEN</Link>

      <nav className={styles.nav}>
        {menus.map((m) => (
          <Link key={m.label} to={m.to}>{m.label}</Link>
        ))}
      </nav>

      <div className={styles.util}>
        <span>KO</span>
        {util}
      </div>
    </header>
  )
}
