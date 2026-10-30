import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// - '@' 별칭 = src  (tsconfig.app.json 의 paths 와 반드시 같이 설정)
// - /api 를 백엔드(8080)로 프록시 → 브라우저에선 same-origin 이라 CORS 이슈 없음
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
