import { useUserStore } from '@/store/user'
import useToast from 'vue-toastification'

const API_URL = 'https://api.example.com'
const toast = useToast()

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const json = await response.json()

    if (!json.isSuccess) {
      if (json.code === 403) {
        const userStore = useUserStore()
        userStore.logout()
        toast.warning('You need to log in first.')
      }
      toast.error(json.data?.message || `Something went wrong.`)
    }

    return json.data
  } catch (error) {
    toast.error(`Something went wrong, try again later.`)
    throw error
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiGet<T>(url: string, query?: Record<string, any>) {
  const queryString = query ? '?' + new URLSearchParams(query).toString() : ''
  return apiRequest<T>(`${url}${queryString}`, { method: 'GET' })
}

export function apiPost<T>(url: string, body: unknown) {
  return apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function apiPut<T>(url: string, body: unknown) {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}
