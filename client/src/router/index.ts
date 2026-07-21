import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/Index.vue'),
    },
    {
      path: '/:meetId',
      name: 'meet',
      component: () => import('../views/Meet.vue'),
    },
  ],
});

export default router;
