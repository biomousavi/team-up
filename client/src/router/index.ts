import { createRouter, createWebHistory } from 'vue-router';
import IndexView from '../views/Index.vue';
import MeetView from '../views/Meet.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
    {
      path: '/:meetId',
      name: 'meet',
      component: MeetView,
    },
  ],
});

export default router;
