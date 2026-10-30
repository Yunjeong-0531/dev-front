/** 쿼리 키는 feature 이름으로 시작해 다른 feature 와 겹치지 않게 한다. */
export const authKeys = {
  all: ['auth'] as const,
  terms: () => [...authKeys.all, 'terms'] as const,
  me: (userId?: number) => [...authKeys.all, 'me', userId] as const,
}
