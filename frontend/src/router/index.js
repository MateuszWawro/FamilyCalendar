import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

import Login from '../pages/LoginView.vue'
import Calendar from '../pages/CalendarView.vue'

const routes = [
  { path: '/login', component: Login },
  { 
    path: '/calendar',
    component: Calendar,
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔒 Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router