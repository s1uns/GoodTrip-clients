// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

import { useUserStore } from '@/store/user'

import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.adminOnly && !userStore.isAdmin) {
    return next('/places')
  }

  if (to.meta.clientOnly && !userStore.isClient) {
    return next('/admin-panel')
  }

  next()
})

export default router
