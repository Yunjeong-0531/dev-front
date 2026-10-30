import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// /api 요청을 백엔드(8080)로 프록시 → 브라우저 입장에서는 same-origin 이라 CORS 이슈가 없다.
// 포트 3000 은 백엔드 application.yml 의 frontend-base-url / allowed-origins 와 맞춘 값.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
