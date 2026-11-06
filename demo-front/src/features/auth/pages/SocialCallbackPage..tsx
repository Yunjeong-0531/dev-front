import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ErrorBox } from '@/common/components/ErrorBox'
import { useSocialLogin } from '../hooks/mutations'
import { consumeSocialState, isSocialProviderId, redirectUriFor } from '../social/providers'
import type { SocialSignupState } from '../types'


/**
 * 제공자 로그인 후 돌아오는 페이지: 
 * - 인가 코드는 한 번만 쓸 수 있다. 개발 모드(StrictMode)에서 effect가 두 번 실행되어도 한 번만 보내도록 ref로 막는다
 * - 기존 회원: 토큰 저장(훅) 후 홈으로/ 신규 회원:약관 동의 화면(/signup/social)으로 
 * */

export 
