import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(() => {
  return {
    plugins: [vue(), vuetify({ styles: { configFile: 'src/assets/settings.scss' } })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    envDir: '../',
    server: {
      host: '0.0.0.0',
      hmr: {
        host: 'localhost',
      },
      port: parseInt(process.env.VITE_SERVER_PORT!) || 3000,
    },
  };
});
