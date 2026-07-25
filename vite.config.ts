import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works both under the GitHub Pages sub-path
// (/simple-incremental/) and when embedded through an <iframe> on any host.
export default defineConfig({
  base: './',
  plugins: [react()],
});
