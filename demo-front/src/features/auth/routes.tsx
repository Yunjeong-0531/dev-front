import type { RouteObject } from 'react-router-dom'
import { AuthPageLayout } from './components/AuthPageLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import ResendEmailPage from './pages/ResendEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SignupPage from './pages/SignupPage'
import SocialCallbackPage from './pages/SocialCallbackPage'
import SocialDebugPage from './pages/SocialDebugPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import SocialSignupPage from './pages/SocialSignupPage'

/** auth 담당 라우트. App.tsx 에서 펼쳐서(...authRoutes) 조립한다. */
export const authRoutes: RouteObject[] = [
  {
    element: <AuthPageLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      //소셜 로그인:제공자가 돌려보내는 콜백(제공자 콘솔의 Redirect URI와 일치해야 한다)/신규 회원 가입 마무리
      { path: '/auth/callback/:provider', element: <SocialCallbackPage/>},
      { path: '/signup/social', element:<SocialSignupPage />},
      
      // 아래 두 경로는 백엔드 메일 링크(frontend-base-url + 경로)와 일치해야 한다
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/resend-email', element: <ResendEmailPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/me', element: <ProtectedRoute><MyPage /></ProtectedRoute> },
      ...(import.meta.env.DEV ? [{ path: '/social-debug', element: <SocialDebugPage /> }] : []),
    ],
  },
]
