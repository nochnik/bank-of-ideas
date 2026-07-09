import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { SignInPage } from '@/components/ui/sign-in'
import { useToasts } from '@/components/ui/toast'
import type { Role } from '@/types'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const toasts = useToasts()

  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const username = fd.get('username') as string
    const password = fd.get('password') as string
    try {
      const data = await login({ username, password })
      setAuth(data.token, data.role as Role, data.userId)
      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    } catch {
      toasts.error(t('auth.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SignInPage
      title="Добро пожаловать"
      description="КазМунайГаз · Программа непрерывного совершенствования"
      splineScene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
      onSignIn={handleSignIn}
      onBackHome={() => navigate('/')}
      backHomeLabel={`← ${t('nav.home')}`}
      logoSrc={`${import.meta.env.BASE_URL}KazMunayGas_logo.svg`}
      logoFilter="none"
      usernameLabel={t('auth.username')}
      usernamePlaceholder="Введите логин"
      passwordLabel={t('auth.password')}
      passwordPlaceholder="••••••••"
      submitLabel={loading ? t('auth.loading') : t('auth.login')}
      loading={loading}
    />
  )
}
