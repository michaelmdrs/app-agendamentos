import { createRouter, createWebHistory } from 'vue-router'
import ClientBooking from '../views/ClientBooking.vue'
import LandingPage from '../views/LandingPage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminCompanySettings from '../views/AdminCompanySettings.vue'
import AdminProfessionals from '../views/AdminProfessionals.vue'
import AdminServices from '../views/AdminServices.vue'
import AdminLogin from '../views/AdminLogin.vue'
import { auth } from '../services/auth'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/demo', redirect: '/barbeariagriffs' },
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin', component: AdminDashboard },
  { path: '/admin/servicos', component: AdminServices },
  { path: '/admin/profissionais', component: AdminProfessionals },
  { path: '/admin/configuracao', component: AdminCompanySettings },
  { path: '/:slug', component: ClientBooking }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAdminRoute = to.path.startsWith('/admin') && to.path !== '/admin/login'

  if (isAdminRoute && !auth.isLoggedIn()) {
    next('/admin/login')
    return
  }

  next()
})