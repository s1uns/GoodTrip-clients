import LoginPage from '@/views/LoginPage .vue'
import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    adminOnly?: boolean
    clientOnly?: boolean
    requiresAuth: boolean
  }
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  // { path: '/profile', component: Profile, meta: { requiresAuth: true, clientOnly: true } },
  // { path: '/places', component: Places, meta: { requiresAuth: true, clientOnly: true } },
  // { path: '/profile', component: Places, meta: { requiresAuth: true, clientOnly: true } },
]

export default routes
