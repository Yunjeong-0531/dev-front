import { useState } from 'react'
import { stays, regions, tags } from '../data/stays'

function StayBoard() {
  // 지금 선택된 탭을 기억하는 "상태". 바뀌면 화면이 자동으로 다시 그려져요.
  const [selectedTag, setSelectedTag] = useState('전체')

  // 선택된 탭에 맞는 숙소만 걸름
  const filtered =
    selectedTag === '전체' ? stays : stays.filter((s) => s.tag === selectedTag)

  return (
    <section id="stays" className="board-section">
      <div className="container">
        <p className="eyebrow">COLLECTION</p>
        <h2 className="section-title">지역별로 만나는 스테이</h2>

        {/* 테마 탭 */}
        <div className="tabs">
          {['전체', ...tags].map((tag) => (
            <button
              key={tag}
              className={tag === selectedTag ? 'tab active' : 'tab'}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 칸반 보드: 지역마다 열 하나 */}
        <div className="board">
          {regions.map((region) => {
            const items = filtered.filter((s) => s.region === region)

            return (
              <div className="column" key={region}>
                <div className="column-head">
                  <h3>{region}</h3>
                  <span>{items.length}</span>
                </div>

                {items.length === 0 && <p className="empty">준비 중입니다</p>}

                {items.map((stay) => (
                  <article className="card" key={stay.id}>
                    <div
                      className="card-img"
                      style={{
                        background: stay.image
                          ? `url(${stay.image}) center / cover`
                          : stay.tone,
                      }}
                    >
                      <span className="badge">{stay.tag}</span>
                      {stay.discount && (
                        <span className="discount">{stay.discount}%</span>
                      )}
                    </div>
                    <div className="card-body">
                      <h4>{stay.name}</h4>
                      <p className="meta">
                        {stay.place} · {stay.guests}
                      </p>
                      <p className="price">
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

export default StayBoard