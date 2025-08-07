import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Enable CORS for Grafana Alloy
    cors: {
      origin: ['http://localhost:12347'],
      credentials: true,
    },
  },
  // Define environment variables if needed
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
