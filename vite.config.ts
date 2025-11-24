import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/visus/', // Important for GitHub Pages relative paths
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});

//import { defineConfig } from 'vite'
//export default defineConfig({
//  base: '/visus/',   // <--- NAZWA REPO
//})
