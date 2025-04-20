import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/shozo-weather-sound/', // リポジトリ名に合わせたパスを設定
})