import { useState } from 'react'
import { stays, regions, tags } from '../data/stays'
import styles from './StayBoard.module.css'

export function StayBoard() {
  // 지금 선택된 탭을 기억하는 "상태". 바뀌면 화면이 자동으로 다시 그려져요.
  const [selectedTag, setSelectedTag] = useState('전체')

  // 선택된 탭에 맞는 숙소만 걸름
  const filtered =
    selectedTag === '전체' ? stays : stays.filter((s) => s.tag === selectedTag)

  return (
    <section id="stays" className={styles.section}>
      <div className="container">
        <p className="eyebrow">COLLECTION</p>
        <h2 className="section-title">지역별로 만나는 스테이</h2>

        {/* 테마 탭 */}
        <div className={styles.tabs}>
          {['전체', ...tags].map((tag) => (
            <button
              key={tag}
              className={tag === selectedTag ? `${styles.tab} ${styles.active}` : styles.tab}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 칸반 보드: 지역마다 열 하나 */}
        <div className={styles.board}>
          {regions.map((region) => {
            const items = filtered.filter((s) => s.region === region)

            return (
              <div className={styles.column} key={region}>
                <div className={styles.columnHead}>
                  <h3>{region}</h3>
                  <span>{items.length}</span>
                </div>

                {items.length === 0 && <p className={styles.empty}>준비 중입니다</p>}

                {items.map((stay) => (
                  <article className={styles.card} key={stay.id}>
                    <div
                      className={styles.cardImg}
                      style={{
                        background: stay.image
                          ? `url(${stay.image}) center / cover`
                          : stay.tone,
                      }}
                    >
                      <span className={styles.badge}>{stay.tag}</span>
                      {stay.discount && (
                        <span className={styles.discount}>{stay.discount}%</span>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <h4>{stay.name}</h4>
                      <p className={styles.meta}>
                        {stay.place} · {stay.guests}
                      </p>
                      <p className={styles.price}>
                        ₩{stay.price.toLocaleString('ko-KR')}~
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
