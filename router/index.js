import { createRouter, createWebHistory } from 'vue-router'
import ClientBooking from '../views/ClientBooking.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  { path: '/', component: ClientBooking },
  { path: '/admin', component: AdminDashboard }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})