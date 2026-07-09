import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  toggle: () => void
  setTheme: (theme: Theme) => void
}

function applyTheme(theme: Theme) {
  const html = document.documentElement
  html.classList.remove('dark', 'light')
  html.classList.add(theme)
  html.setAttribute('data-theme', theme)
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggle: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    { name: 'dmaic-theme' }
  )
)

export function initTheme() {
  const stored = localStorage.getItem('dmaic-theme')
  let theme: Theme = 'dark'
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed.state?.theme === 'light') theme = 'light'
    } catch {}
  }
  applyTheme(theme)
}
