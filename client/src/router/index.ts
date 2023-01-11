import socket from '@/socket';
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

router.beforeEach(() => {
  if (!socket.connected) socket.connect();
});
export default router;
