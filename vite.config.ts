import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const resendApiKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || '';
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ukgjkmjhhxtaedxyhaeu.supabase.co';
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || '';

  const supabaseDevMiddleware = {
    name: 'supabase-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', async () => {
            try {
              const { createClient } = await import('@supabase/supabase-js');
              const supabase = createClient(supabaseUrl, serviceKey);
              const data = JSON.parse(body);
              const { image, filename: requestedName, folder = 'uploads' } = data;

              let buffer: Buffer;
              let contentType = 'image/webp';
              let ext = 'webp';

              if (image.startsWith('data:')) {
                const match = image.match(/^data:([^;]+);base64,(.+)$/);
                if (match) {
                  contentType = match[1];
                  buffer = Buffer.from(match[2], 'base64');
                  if (contentType.includes('png')) ext = 'png';
                  else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpeg';
                  else if (contentType.includes('webp')) ext = 'webp';
                  else if (contentType.includes('gif')) ext = 'gif';
                } else {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ success: false, message: 'Invalid data format' }));
                  return;
                }
              } else {
                buffer = Buffer.from(image, 'base64');
              }

              const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
              const cleanPrefix = (requestedName || 'media').replace(/[^a-zA-Z0-9_-]/g, '-').substring(0, 30);
              const finalFilename = `${folder}/${cleanPrefix}-${uniqueId}.${ext}`;

              const { error } = await supabase.storage.from('product-images').upload(finalFilename, buffer, {
                contentType,
                upsert: true,
              });

              if (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: error.message }));
                return;
              }

              const { data: pubData } = supabase.storage.from('product-images').getPublicUrl(finalFilename);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, publicUrl: pubData.publicUrl, path: finalFilename }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err?.message || 'Upload failed' }));
            }
          });
          return;
        }

        if (req.url === '/api/sync-home-media') {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', async () => {
              try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, serviceKey);
                const { items } = JSON.parse(body);
                const buffer = Buffer.from(JSON.stringify(items, null, 2));
                const { error } = await supabase.storage.from('product-images').upload('home-media-config.json', buffer, {
                  contentType: 'application/json',
                  upsert: true,
                });
                if (error) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, message: error.message }));
                  return;
                }
                const pub = supabase.storage.from('product-images').getPublicUrl('home-media-config.json').data.publicUrl;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, publicUrl: pub }));
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: e.message }));
              }
            });
            return;
          }
        }

        next();
      });
    },
  };

  return {
    plugins: [react(), supabaseDevMiddleware],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
                return 'vendor-pdf';
              }
            }
          },
        },
      },
    },
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
