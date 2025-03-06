import { defineStore } from 'pinia'

import { USER_ADMIN, USER_CLIENT } from '@/utils/constants'

interface User {
  role: number
  login: string
  email: string
  firstName: string
  lastName: string
  profileUrl: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isClient: (state) => state.user?.role === USER_CLIENT,
    isAdmin: (state) => state.user?.role === USER_ADMIN,
  },
  actions: {
    login(userData: User) {
      this.user = userData
    },
    logout() {
      this.user = null
    },
  },
})
