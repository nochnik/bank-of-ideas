import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/types'

interface AuthState {
  token: string | null
  role: Role | null
  userId: number | null
  setAuth: (token: string, role: Role, userId: number) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      userId: null,
      setAuth: (token, role, userId) => set({ token, role, userId }),
      logout: () => set({ token: null, role: null, userId: null }),
    }),
    { name: 'dmaic-auth' },
  ),
)
