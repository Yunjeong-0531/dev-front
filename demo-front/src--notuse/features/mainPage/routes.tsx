import type { RouteObject } from 'react-router-dom'
import MainPage from './MainPage';



export const mainRoutes: RouteObject[] = [
  { path: '/main', element: <MainPage /> },
]
