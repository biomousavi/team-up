import '@animxyz/core';
import 'webrtc-adapter';
import './assets/main.css';
import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import vuetify from './plugins/vuetify';
import VueAnimXyz from '@animxyz/vue3';

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(VueAnimXyz);
app.use(createPinia());

app.mount('#app');
