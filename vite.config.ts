import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const resendApiKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || '';

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    server: {
      proxy: {
        '/api/resend': {
          target: 'https://api.resend.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/resend/, ''),
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
          },
        },
      },
    },
  };
});
