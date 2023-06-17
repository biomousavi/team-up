import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(() => {
  return {
    plugins: [
      // vue plugin to work withg vue framework
      vue(),

      // to auto import vuetify components and configurations
      vuetify({ styles: { configFile: 'src/assets/settings.scss' } }),
    ],

    // add path alias
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },

    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    define: { global: 'globalThis' },

    // define env file directory
    envDir: '../',

    // config vite dev server
    server: {
      host: '0.0.0.0',
      hmr: { host: 'localhost' },
      port: parseInt(process.env.VITE_SERVER_PORT!) || 3000,
    },
  };
});
