import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Local live-data path: the real board is same-origin on the apex, so dev and
// preview proxy the one endpoint. Production builds are untouched by this.
const statusProxy = {
  '/api/status': {
    target: 'https://youssefvdel.dpdns.org',
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: statusProxy },
  preview: { proxy: statusProxy },
})
