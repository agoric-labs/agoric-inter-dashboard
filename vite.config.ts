import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import alias from '@rollup/plugin-alias';

const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/cubejs-api': {
        target: process.env.API_URL || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    alias({
      entries: [
        {
          find: '@',
          replacement: resolve(projectRootDir, 'src')
        }
      ]
    })
  ],
});
