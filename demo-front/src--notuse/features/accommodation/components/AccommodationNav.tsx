import { Link } from 'react-router-dom'

/** accommodation 담당 메뉴. App.tsx 가 Layout 의 nav 로 조립한다. */
export function AccommodationNav() {
  return <Link to="/accommodations">숙소</Link>
}
