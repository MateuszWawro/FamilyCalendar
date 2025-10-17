import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../pages/CalendarView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/calendar'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Strona wymaga autoryzacji, ale użytkownik nie jest zalogowany
    next('/login');
  } else if (to.meta.guest && isAuthenticated) {
    // Użytkownik zalogowany próbuje wejść na stronę dla gości (login/register)
    next('/calendar');
  } else {
    next();
  }
});

export default router;