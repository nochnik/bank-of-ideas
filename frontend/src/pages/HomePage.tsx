import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { motion } from 'motion/react'
import { ArrowRight, ChartLineUp, Trophy, AirplaneTilt } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import Leaderboard from '@/components/Leaderboard'
import DMAICTimeline from '@/components/DMAICTimeline'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { HeroCanvas } from '@/components/ui/hero-canvas'
import { getLeaderboard } from '@/api/leaderboard'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import type { LeaderboardEntry } from '@/types'

const ease = [0.32, 0.72, 0, 1] as const

export default function HomePage() {
  const { t } = useTranslation()
  const { role } = useAuthStore()
  const { theme } = useThemeStore()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard().then(setEntries).finally(() => setLoading(false))
  }, [])

  const cta = !role
    ? { to: '/login', label: t('home.cta_login') }
    : role === 'PARTICIPANT'
      ? { to: '/dashboard', label: t('home.cta_dashboard') }
      : { to: '/admin', label: t('home.cta_admin') }

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24" style={{ position: 'relative' }}>
        <HeroCanvas />
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease }}
        >
          {/* Logo + DMAIC Platform label */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '32px', marginLeft: '-0px' }}>
            <img
              src={`${import.meta.env.BASE_URL}KazMunayGas_logo.svg`}
              alt="KazMunayGas"
              style={{
                height: '100px', width: 'auto',
                filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
                opacity: theme === 'dark' ? 0.9 : 1,
                transition: 'filter 0.3s ease',
              }}
            />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
              <span className="eyebrow" style={{ color: 'var(--ink-subtle)' }}>DMAIC Platform</span>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 500, lineHeight: 1.04,
            letterSpacing: '-0.02em', color: 'var(--ink)',
            marginBottom: '20px', maxWidth: '700px',
            fontFamily: 'Gilroy, sans-serif'
          }}>
            <Trans
              i18nKey="home.hero_title"
              components={{ br: <br />, accent: <span style={{ color: 'var(--accent)' }} /> }}
            />
          </h1>

          <p style={{ fontSize: '1.0625rem', color: 'var(--ink-subtle)', maxWidth: '480px', lineHeight: 1.65, marginBottom: '36px', fontWeight: 400 }}>
            {t('home.hero_subtitle')}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div whileHover="hover" initial="rest" animate="rest">
              <Link to={cta.to}>
                <motion.span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0px',
                  borderRadius: '9999px', background: 'var(--accent)',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  padding: '11px 20px', overflow: 'hidden', position: 'relative',
                }}>
                  <motion.span
                    variants={{
                      rest: { width: 0, opacity: 0, marginRight: 0 },
                      hover: { width: '18px', opacity: 1, marginRight: '6px' },
                    }}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                    style={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}
                  >
                    <ArrowRight size={14} weight="bold" />
                  </motion.span>
                  {cta.label}
                </motion.span>
              </Link>
            </motion.div>
            <span style={{ fontSize: '13px', color: 'var(--ink-tertiary)', fontWeight: 500 }}>
              {t('home.start_date')}
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── Leaderboard ───────────────────────────────────────────── */}
      <section id="leaderboard-section" style={{ marginBottom: '40px', scrollMarginTop: '80px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '8px' }}>{t('home.leaderboard_eyebrow')}</p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500,
            letterSpacing: '-0.02em', color: 'var(--ink)',
            lineHeight: 1.1, marginBottom: '12px',
            fontFamily: 'Gilroy, sans-serif'
          }}>
            {t('leaderboard.title')}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink-subtle)', fontWeight: 400, maxWidth: '420px' }}>
            {t('home.leaderboard_sub')}
          </p>
        </div>
        <ContainerScroll>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <motion.div
                style={{ fontSize: '14px', color: 'var(--ink-tertiary)' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {t('home.loading')}
              </motion.div>
            </div>
          ) : (
            <div style={{ height: '100%', overflowY: 'auto', padding: '4px' }}>
              <Leaderboard entries={entries} />
            </div>
          )}
        </ContainerScroll>
      </section>

      {/* ── About Section ─────────────────────────────────────────── */}
      <section className="py-20 mb-10 border-t border-hl/30 scroll-mt-20" id="about-section">
        <div className="text-center mb-16">
          <p className="eyebrow mb-2">О ПЛАТФОРМЕ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">Как работает геймификация DMAIC?</h2>
          <p className="text-body text-ink-subtle max-w-2xl mx-auto">
            Платформа объединяет строгую методологию непрерывного совершенствования Six Sigma с соревновательными механиками, чтобы сделать процесс оптимизации увлекательным и прозрачным.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-s1 border border-hl hover:border-ink/20 transition-colors">
            <div className="text-ink mb-4">
              <ChartLineUp size={32} weight="light" />
            </div>
            <h3 className="text-lg font-medium text-ink mb-2">4 этапа DMAIC</h3>
            <p className="text-sm text-ink-subtle leading-relaxed">
              Участники последовательно проходят этапы Define, Measure, Improve и Control. Загружайте документы, карты процессов и защищайте свои проекты перед экспертами.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-s1 border border-hl hover:border-ink/20 transition-colors">
            <div className="text-ink mb-4">
              <Trophy size={32} weight="light" />
            </div>
            <h3 className="text-lg font-medium text-ink mb-2">Система баррелей</h3>
            <p className="text-sm text-ink-subtle leading-relaxed">
              За успешное прохождение каждого этапа администраторы выставляют оценку от 0 до 100, которая автоматически конвертируется в баррели (до 5 баррелей за этап).
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-s1 border border-hl hover:border-ink/20 transition-colors">
            <div className="text-ink mb-4">
              <AirplaneTilt size={32} weight="light" />
            </div>
            <h3 className="text-lg font-medium text-ink mb-2">Ценные награды</h3>
            <p className="text-sm text-ink-subtle leading-relaxed">
              Накопите максимум в 20 баррелей и выиграйте главный приз — оплачиваемую стажировку в Японии! Лидерское обучение, мерч и фирменные значки ждут остальных победителей.
            </p>
          </div>
        </div>
      </section>

      {/* ── DMAIC Timeline ────────────────────────────────────────── */}
      <section style={{ paddingBottom: '80px', scrollMarginTop: '80px' }}>
        <DMAICTimeline />
      </section>

      {/* ── CTA Section ───────────────────────────────────────────── */}
      <section className="relative py-24 mb-12 text-center overflow-hidden rounded-[2rem] border border-hl/50 bg-s1 shadow-2xl">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(91,141,238,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(91,141,238,0.15)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-hl bg-s2 text-caption text-ink-subtle font-medium tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Присоединяйтесь
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4 max-w-2xl mx-auto" style={{ lineHeight: 1.15 }}>
              Готовы начать свой первый проект DMAIC?
            </h2>
            <p className="text-body text-ink-subtle max-w-md mx-auto mb-10 leading-relaxed">
              Улучшайте бизнес-процессы компании, получайте баррели за каждый успешный этап и забирайте главные награды в конце года.
            </p>
            
            <motion.div whileHover="hover" initial="rest" animate="rest">
              <Link to={cta.to}>
                <motion.span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0px',
                  borderRadius: '9999px', background: 'var(--accent)',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  padding: '12px 24px', overflow: 'hidden', position: 'relative',
                  boxShadow: '0 0 20px rgba(91,141,238,0.2)'
                }}>
                  <motion.span
                    variants={{
                      rest: { width: 0, opacity: 0, marginRight: 0 },
                      hover: { width: '18px', opacity: 1, marginRight: '6px' },
                    }}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                    style={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}
                  >
                    <ArrowRight size={14} weight="bold" />
                  </motion.span>
                  Войти в платформу
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </Layout>
  )
}
