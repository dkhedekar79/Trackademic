import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',   // ensures assets resolve correctly on deploy
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons';
            }
            return 'vendor';
          }

          // Separate chunks for different groups
          if (id.includes('/pages/')) return 'pages';
          if (id.includes('/components/')) return 'components';
          if (id.includes('/context/')) return 'context';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true, // source maps for debugging
  },
  publicDir: 'public',
  esbuild: {
    drop: ['console', 'debugger'], // strip console/debugger in prod
  },
});
