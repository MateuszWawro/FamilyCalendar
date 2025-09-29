import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../pages/HomeView.vue'
//import Calendar from '../pages/CalendarView.vue'
//import Login from '../pages/LoginView.vue'
//import Register from '../pages/RegisterView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/calendar', name: 'Calendar', component: CalendarView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router