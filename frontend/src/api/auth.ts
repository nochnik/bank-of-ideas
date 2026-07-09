import api from './client'
import type { UserProfile } from '@/types'

export interface LoginPayload { username: string; password: string }
export interface AuthResponse { token: string; role: string; userId: number }

export const login = (payload: LoginPayload) =>
  api.post<AuthResponse>('/auth/login', payload).then((r) => r.data)

export const getMe = () =>
  api.get<UserProfile>('/users/me').then((r) => r.data)
