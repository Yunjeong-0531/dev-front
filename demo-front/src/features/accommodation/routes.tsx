import type { RouteObject } from 'react-router-dom'
import AccommodationListPage from './pages/AccommodationListPage'

export const accommodationRoutes: RouteObject[] = [
  { path: '/accommodations', element: <AccommodationListPage /> },
]
