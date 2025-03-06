import type { UserProfile } from '@/utils/types'
import { apiGet, apiPut } from './api'

export function getUserProfile() {
  return apiGet('/user/profile')
}

export function updateUserProfile(data: UserProfile) {
  return apiPut('/user/profile', data)
}
