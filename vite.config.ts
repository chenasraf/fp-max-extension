import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import svgr from '@svgr/rollup'
import path from 'path'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // manifest: path.resolve(__dirname, 'manifest.json'),
        content_script: path.resolve(__dirname, 'src', 'content_script.ts'),
        worker: path.resolve(__dirname, 'src', 'worker.ts'),
        options: path.resolve(__dirname, 'options.html'),
        popup: path.resolve(__dirname, 'popup.html'),
      },
    },
  },
  plugins: [
    preact({
      babel: {
        plugins: [
          [
            '@locator/babel-jsx/dist',
            {
              env: 'development',
            },
          ],
        ],
      },
    }),
    svgr(),
    crx({ manifest }),
  ],
  server: {
    port: 4500,
  },
  // optimizeDeps: {
  //   include: ['acroasis-shared'],
  // },
  // build: {
  //   commonjsOptions: {
  //     include: [/acroasis-shared/, /node_modules/],
  //   },
  // },
})
