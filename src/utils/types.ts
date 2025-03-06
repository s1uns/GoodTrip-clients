export interface UserCredentials {
  login: string
  password: string
}

export interface UserProfile {
  firstName: string
  lastName: string
  bio: string
  preferences: string[]
  avatarUrl: string
}
