import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        secure: false, // Allows connections even if there are certificate issues
        rewrite: (path) => path.replace(/^\/api-openai/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('Proxy Error:', err));
        }
      },
    },
  },
});