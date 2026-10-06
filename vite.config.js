import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

const STATIC_ASSETS = [
  'tracks.js',
  'part1.mp4',
  'part1_1080.mp4',
  'part1_4k.mp4',
  'part2.mp4',
  'part2_1080.mp4',
  'part2_4k.mp4',
];

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), '.'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  plugins: [
    tailwindcss(),
    {
      name: 'copy-root-media-assets',
      closeBundle() {
        const outDir = path.resolve(process.cwd(), 'dist');
        if (!fs.existsSync(outDir)) return;
        for (const file of STATIC_ASSETS) {
          const src = path.resolve(process.cwd(), file);
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(outDir, file));
          }
        }
      },
    },
  ],
});

