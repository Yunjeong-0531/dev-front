import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

/* 푸터 */
export function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className="container">
        <p className={styles.brand}>GREEN</p>
        <div className={styles.links}>
          <Link to="/#stays">STAYS</Link>
          <Link to="/#about">ABOUT</Link>
          <Link to="/#top">TOP</Link>
        </div>
        <p className={styles.copy}>© 2026 VINÉA. All rights reserved.</p>
      </div>
    </footer>
  )
}
