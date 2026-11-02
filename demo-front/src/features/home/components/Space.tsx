import styles from './Space.module.css'

/* 메인 헤더와 바디를 나눠주는 소개 영역 */
export function Space() {
  return (
    <section id="about" className={styles.space}>
      <p className="eyebrow">ABOUT</p>
      <h2 className={styles.title}>가장 조용한 방식의 호사</h2>
    </section>
  )
}
