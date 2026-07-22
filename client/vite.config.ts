import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(() => {
  return {
    plugins: [
      // vue plugin to work withg vue framework
      vue(),

      // to auto import vuetify components and configurations
      vuetify({ styles: { configFile: 'src/assets/settings.scss' } }),

      // simple-peer (via readable-stream) needs Node's events/util/stream plus
      // Buffer/process/global in the browser. Vite 7 externalizes those
      // built-ins to empty stubs, which makes `new Peer()` throw
      // ("Cannot read properties of undefined (reading 'call')"). Polyfill them.
      nodePolyfills({
        include: ['events', 'util', 'stream', 'buffer', 'process'],
        globals: { Buffer: true, global: true, process: true },
      }),
    ],

    // add path alias
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },

    // define env file directory
    envDir: '../',

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vuetify: ['vuetify'],
          },
        },
      },
    },

    // config vite dev server
    server: {
      host: '0.0.0.0',
      hmr: { host: 'localhost' },
      port: parseInt(process.env.VITE_SERVER_PORT!) || 3000,
    },
  };
});
