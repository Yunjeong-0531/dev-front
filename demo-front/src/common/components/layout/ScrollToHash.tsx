import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * react-router 는 '/#stays' 같은 해시 이동 시 자동으로 스크롤하지 않으므로 직접 처리한다.
 *  - 해시가 있으면 해당 id 요소로 스크롤 (같은 링크를 다시 눌러도 동작: key 가 매번 바뀜)
 *  - 해시가 없고 "페이지(pathname)"가 바뀌었으면 맨 위로 (쿼리스트링만 바뀐 경우는 건드리지 않음)
 */
export function ScrollToHash() {
  const { pathname, hash, key } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    const pathChanged = prevPath.current !== pathname
    prevPath.current = pathname

    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView()
      else window.scrollTo({ top: 0, behavior: 'instant' })
    } else if (pathChanged) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash, key])

  return null
}
