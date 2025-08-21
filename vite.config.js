import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // Separate chunks for large libraries
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

          // Separate chunks for different page groups
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
          if (id.includes('/context/')) {
            return 'context';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging
    sourcemap: true,
  },
  publicDir: 'public',
  // Enable build optimizations
  esbuild: {
    drop: ['console', 'debugger'],
  },
});
