// No seu vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        secure: false, // Permite conexões mesmo se o Bolt tiver problemas de certificado
        rewrite: (path) => path.replace(/^\/api-openai/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('Proxy Error:', err));
        }
      },
    },
  },
});