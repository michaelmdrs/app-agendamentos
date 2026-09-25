import { createRouter, createWebHistory } from 'vue-router'
import ClientBooking from '../views/ClientBooking.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminCompanySettings from '../views/AdminCompanySettings.vue'

const routes = [
  { path: '/', component: ClientBooking },
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/configuracao', component: AdminCompanySettings }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})