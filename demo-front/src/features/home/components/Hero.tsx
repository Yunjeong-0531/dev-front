import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} id="top">
      {/* 버건디 굵은 띠로 둘러싼 사진 (화면 가득) */}
      <div className={styles.frame}>
        <div className={styles.image}></div>
      </div>
    </section>
  )
}
