/**
 * 소셜 로그인(인가 코드 방식)의 "프론트 쪽" 절차.
 *  1) startSocialLogin(provider) -> 제공자 로그인 화면으로 이동 
 *     (state를 만들어 sessionStorage에 저장)
 *  2) 제공자가 /auth/callback/{provider}?code=..&state=..로 돌려보냄 (SocialCallbackPage)
 *  3) state를 검증(consumeSocialState)한 뒤 code를 백엔드로 전달 -> 백엔드가 client-secret으로 토큰 교환
 * client-id는 공개되어도 되는 값이라 프론트 env(VITE_*)에 둔다. client-secret은 절대 프론트에 두지 않는다. 
 */


export type SocialProviderId = 'kakao' | 'naver' | 'google'

interface SocialProviderConfig{
    id: SocialProviderId
    label: string
    clientId: string | undefined
    authorizeUrl: string
    /**제공자별 추가 파라미터 (동의 항목 등) */
    extraParams: Record<string, string>
}

const env = import.meta.env

const ALL_PROVIDERS: SocialProviderConfig[] = [
    {
        id: 'kakao',
        label: '카카오',
        clientId: env.VITE_KAKAO_CLIENT_ID, //카카오 REST API 키
        authorizeUrl: 'https://kauth.kakao.com/oauth/authorize',
        extraParams: { scope: 'profile_nickname,account_email'},
    },
    {
        id:'naver',
        label:'네이버',
        clientId: env.VITE_NAVER_CLIENT_ID,
        authorizeUrl: 'https://nid.naver.com/oauth2.0/authorize',
        extraParams: {}, //동의 항목은 네이버 개발자센터에서 설정

    },
    {
        id:'google',
        label:'구글',
        clientId : env.VITE_GOOGLE_CLIENT_ID,
        authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        extraParams: { scope:'openid email profile', prompt: 'select_account' }
    },
]
/** client-id가 설정된 제공자만 버튼으로 노출된다 */
export const enabledSocialProviders = ALL_PROVIDERS.filter((p)=> !!p.clientId)

export function isSocialProviderId(v: string | undefined): v is SocialProviderId {
    return v === 'kakao' || v === 'naver' || v === 'google'
}

/**
 * 제공자 콘솔에 등록하는 Redirect URI. 
 * 벡엔드는 (frontend-base-url + 이 경로)와 "정확히 같은지" 검사한다. 
 */
export function redirectUriFor(id: SocialProviderId): string {
    return `${window.location.origin}/auth/callback/${id}`
}

const STATE_KEY = 'stay.social.state'

function randomState(): string {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (b)=> b.toString(16).padStart(2,'0')).join('')
}

/** 제공자 로그인 화면으로 이동한다 (페이지 전체 이동) */
export function startSocialLogin(id: SocialProviderId): void {
    const cfg = ALL_PROVIDERS.find((p) => p.id ===id)
    if (!cfg?.clientId) return
    const state = randomState()
    sessionStorage.setItem(STATE_KEY, JSON.stringify({provider:id, state}))

    const params = new URLSearchParams({
        client_id: cfg.clientId,
        redirect_Uri: redirectUriFor(id),
        response_type: 'code',
        state,
        ...cfg.extraParams,
    })
    window.location.assign(`${cfg.authorizeUrl}?${params.toString()}`)
}

/**
 * 콜백에서 돌아온 state가 우리가 보낸 값과 같은지 검증한다. (CSRF방지). 한 번만 유효.
 */

export function consumeSocialState(id: SocialProviderId, state: string): boolean{
    try {
        const raw = sessionStorage.getItem(STATE_KEY)
        sessionStorage.removeItem(STATE_KEY)
        if(!raw) return false
        const saved = JSON.parse(raw) as { provider: string; state: string}
        return saved.provider === id && saved.state ===state
    } catch {
        return false
    }
}