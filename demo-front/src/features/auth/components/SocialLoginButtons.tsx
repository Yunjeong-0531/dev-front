import { enabledSocialProviders, startSocialLogin } from '../social/providers'
import styles from './SocialLoginButtons.module.css'

/** 소셜 로그인/가입 버튼. .env 에 client-id 가 설정된 제공자만 보인다. */
export function SocialLoginButtons({ title = '소셜 계정으로 계속하기' }: { title?: string }) {
  if (enabledSocialProviders.length === 0) {
    return import.meta.env.DEV ? (
      <p className={styles.hint}>
        소셜 로그인 미설정 — .env 에 VITE_KAKAO_CLIENT_ID 등을 넣으면 버튼이 나타납니다.
      </p>
    ) : null
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.title}>{title}</p>
      <div className={styles.list}>
        {enabledSocialProviders.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.btn} ${styles[p.id]}`}
            onClick={() => startSocialLogin(p.id)}
          >
            {p.label}로 계속하기
          </button>
        ))}
      </div>
    </div>
  )
}
