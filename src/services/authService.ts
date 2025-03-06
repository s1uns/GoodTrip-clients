import { useMutation, useQuery } from '@tanstack/vue-query'
import type { UserCredentials } from '@/utils/types'

import { apiPost, apiGet } from './api'

export function useLogin() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (data: UserCredentials) => apiPost('/auth/login', data),
  })
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => apiGet('/user/profile'),
  })
}
