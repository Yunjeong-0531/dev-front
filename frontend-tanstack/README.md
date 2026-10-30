# 프론트 src (React + TypeScript + Vite + TanStack Query)

## 적용 방법

1. 이 폴더의 `src/`, `vite.config.ts`, `.env.example` 을 프로젝트에 복사 (기존 `src` 는 교체)
2. 패키지 설치
   ```
   npm i react-router-dom @tanstack/react-query
   npm i -D @types/node
   ```
3. **`@` 별칭 설정** — `tsconfig.app.json` 의 `compilerOptions` 에 추가 (vite.config.ts 쪽은 이미 되어 있음)
   ```json
   "paths": { "@/*": ["./src/*"] }
   ```
   루트 `tsconfig.json` 에 `compilerOptions` 가 따로 있다면 거기에도 같은 값을 넣어야 IDE 가 인식한다.
4. 백엔드(8080) 실행 → `npm run dev` → http://localhost:3000
   (백엔드 `app.auth.frontend-base-url` = `http://localhost:3000`)

## 폴더 구조

```
src/
├─ common/                 모든 feature 가 공유 (feature 를 import 하지 않는다)
│  ├─ api/                 http.ts(요청+자동 refresh), tokenStore.ts, queryClient.ts
│  ├─ components/          Layout, ErrorBox/InfoBox, NotFound
│  ├─ types/               api.ts(에러 응답), session.ts(토큰/사용자 요약)
│  └─ index.css
├─ auth/                   인증 담당
│  ├─ api/                 auth.ts, user.ts          (fetch 함수)
│  ├─ hooks/               queryKeys, useMe, useTermsAgreement(쿼리) / mutations(변경)
│  ├─ context/             AuthProvider, auth-context(useAuth)
│  ├─ components/          ProtectedRoute, TermsAgreement, AuthNav, UserMenu
│  ├─ pages/
│  ├─ types.ts
│  ├─ routes.tsx           auth 라우트 목록
│  └─ public.ts            ★ 다른 feature 에 공개하는 API (useAuth, ProtectedRoute)
├─ accommodation/          숙소 담당 (골격만 있음)
├─ App.tsx                 조립 지점: 각 feature 의 routes/Nav 를 합침
└─ main.tsx                Provider 설정 (QueryClient, Router, Auth)
```

## 협업 규칙

| 규칙 | 이유 |
|---|---|
| feature → common import 는 OK | 공용 기반 |
| common → feature import 금지 | common 이 특정 기능에 묶이면 공유 의미가 없어짐 |
| feature ↔ feature 는 `@/auth/public` 같은 공개 API 로만 | 내부 구조를 바꿔도 상대 코드가 안 깨짐 |
| 쿼리 키는 feature 이름으로 시작 (`['accommodation', ...]`) | 캐시 키 충돌 방지 |
| 토큰 갱신/401 처리는 `common/api/http.ts` 에서만 | refresh 가 동시에 여러 번 나가면 백엔드 재사용 감지에 걸려 세션이 끊김 |
| 공용 파일(`common/**`, `App.tsx`)은 작은 PR 로 자주 병합 | 충돌 최소화 |

### 새 feature 추가 절차

1. `src/<feature>/` 에 `api/ hooks/ pages/ components/ routes.tsx` 생성
2. `routes.tsx` 에서 `RouteObject[]` export, 메뉴가 필요하면 `<Feature>Nav` 컴포넌트 export
3. `App.tsx` 에 import 2줄 + `...featureRoutes` + `<FeatureNav />` 추가

### ESLint 로 규칙 강제 (선택, eslint.config.js 에 추가 — 예시)

```js
{
  files: ['src/common/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', { patterns: [
      { group: ['@/auth/*', '@/accommodation/*'], message: 'common 은 feature 를 import 할 수 없습니다.' },
    ] }],
  },
},
{
  files: ['src/accommodation/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', { patterns: [
      { group: ['@/auth/*', '!@/auth/public'], message: 'auth 는 @/auth/public 으로만 import 하세요.' },
    ] }],
  },
},
```

## TanStack Query 사용 규칙 (이 프로젝트)

- 조회는 `useQuery`, 변경은 `useMutation`. fetch 함수는 `api/` 에, 훅은 `hooks/` 에 둔다.
- **토큰 저장/삭제 같은 상태 변경은 훅의 `onSuccess`(mutations.ts)에서**, 화면 이동/메시지는 페이지의 `mutate(vars, { onSuccess })` 에서 처리.
- 사용자가 바뀌면(로그인/로그아웃) `AuthProvider` 가 쿼리 캐시를 비운다. 이전 사용자의 데이터가 다음 사용자에게 보이지 않도록.
- 4xx 응답은 재시도하지 않는다 (`queryClient.ts`).
