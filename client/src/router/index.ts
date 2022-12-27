import { createRouter, createWebHistory } from 'vue-router';
import IndexView from '../views/Index.vue';
import RoomView from '../views/Room.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
    {
      path: '/:roomId',
      name: 'room',
      component: RoomView,
    },
  ],
});

export default router;
