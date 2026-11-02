import { Outlet } from 'react-router-dom'
import styles from './AuthPageLayout.module.css'

/** 인증 화면 공통 틀. authRoutes 의 부모 라우트로 쓰여서 모든 인증 페이지에 같은 스타일이 적용된다. */
export function AuthPageLayout() {
  return (
    <div className={styles.page}>
      <Outlet />
    </div>
  )
}
