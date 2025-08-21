import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Include JSX runtime automatically
      jsxImportSource: 'react'
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
        manualChunks: {
          // Vendor chunk for external dependencies
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // Firebase chunk
          firebase: ['firebase'],
          
          // UI libraries chunk
          ui: ['lucide-react', 'react-icons', 'framer-motion'],
          
          // Swiper chunk (if used heavily)
          swiper: ['swiper'],
          
          // Context chunk
          context: [
            './src/context/AuthContext',
            './src/context/TimerContext', 
            './src/context/GamificationContext'
          ],
          
          // Gamification components chunk
          gamification: [
            './src/components/AchievementSystem',
            './src/components/LeaderboardSystem',
            './src/components/RewardSystem',
            './src/components/QuestSystem',
            './src/components/MysteryBox',
            './src/components/PremiumSystem'
          ]
        },
        
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '') : 'chunk';
          return `assets/[name]-[hash].js`;
        },
        
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
      'firebase',
      'lucide-react',
      'framer-motion'
    ],
    exclude: [
      // Exclude any problematic dependencies
    ]
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    
    // Enable HMR
    hmr: {
      overlay: true
    }
  },
  
  // Preview configuration
  preview: {
    port: 3000,
    strictPort: false,
    host: true
  },
  
  // Define public directory
  publicDir: 'public',
  
  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl: (filename) => {
      return `/${filename}`;
    }
  }
});
