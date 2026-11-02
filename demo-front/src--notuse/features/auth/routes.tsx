import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import ResendEmailPage from './pages/ResendEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SignupPage from './pages/SignupPage'
import SocialDebugPage from './pages/SocialDebugPage'
import VerifyEmailPage from './pages/VerifyEmailPage'

/** auth 담당 라우트. App.tsx 에서 펼쳐서(...authRoutes) 조립한다. */
export const authRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  // 아래 두 경로는 백엔드 메일 링크(frontend-base-url + 경로)와 일치해야 한다
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/resend-email', element: <ResendEmailPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/me', element: <ProtectedRoute><MyPage /></ProtectedRoute> },
  ...(import.meta.env.DEV ? [{ path: '/social-debug', element: <SocialDebugPage /> }] : []),
]
