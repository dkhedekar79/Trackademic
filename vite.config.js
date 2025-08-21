import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true
    })
  ],
  
  build: {
    // Enable source maps for better debugging
    sourcemap: false,
    
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    
    // Advanced rollup options for better code splitting
    rollupOptions: {
      output: {
        // Enhanced manual chunking strategy
        manualChunks: (id) => {
          // Vendor chunk for main React dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            
            // Firebase chunk
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            
            // UI libraries chunk
            if (id.includes('lucide-react') || id.includes('react-icons') || id.includes('framer-motion')) {
              return 'vendor-ui';
            }
            
            // Other vendor libraries
            return 'vendor';
          }
          
          // Gamification components chunk
          if (id.includes('/components/') && 
              (id.includes('Achievement') || id.includes('Leaderboard') || 
               id.includes('Reward') || id.includes('Quest') || 
               id.includes('Mystery') || id.includes('Premium'))) {
            return 'gamification';
          }
        },
        
        // Optimize chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        
        // Optimize asset naming
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Enable minification
    minify: 'esbuild',
    
    // Target modern browsers for better optimization
    target: 'es2020'
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'framer-motion'
    ],
    exclude: [
      'firebase'
    ]
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    
    // Enable HMR
    hmr: {
      overlay: true
    }
  },
  
  // Preview configuration
  preview: {
    port: 5173,
    strictPort: false,
    host: true
  },
  
  // Define public directory
  publicDir: 'public'
});
