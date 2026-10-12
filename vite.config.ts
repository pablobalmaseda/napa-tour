import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { presentationSyncPlugin } from './src/server/viteSyncPlugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), presentationSyncPlugin()],
  server: {
    host: true, // Listen on all network interfaces (0.0.0.0) so phones on local Wi-Fi can connect
    port: 5173
  },
  optimizeDeps: {
    exclude: ['maplibre-gl']
  }
})
