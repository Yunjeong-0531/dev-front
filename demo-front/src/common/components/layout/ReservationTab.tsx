import { Link } from 'react-router-dom'
import styles from './ReservationTab.module.css'

/** 예약 페이지가 생기면 to 를 그쪽 경로로 바꾸면 된다. */
export function ReservationTab({ to = '/#stays' }: { to?: string }) {
  return (
    <Link to={to} className={styles.tab}>RESERVATION</Link>
  )
}
