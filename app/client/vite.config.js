import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const API = `http://127.0.0.1:${process.env.PORT || 3000}`;

export default defineConfig({
  root,
  plugins: [react()],
  server: {
    port: 5173,
    // The sandbox iframe's origin is opaque ("null"), so its module scripts
    // are cross-origin requests and need CORS to load.
    cors: { origin: [/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/, 'null'] },
    proxy: { '/api': API },
  },
  preview: { proxy: { '/api': API } },
  worker: { format: 'es' },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        sandbox: fileURLToPath(new URL('sandbox.html', import.meta.url)),
      },
    },
  },
});
