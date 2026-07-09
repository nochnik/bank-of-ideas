import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Camera, Plus } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import StageCard from '@/components/StageCard'
import BarrelProgress from '@/components/BarrelProgress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getMyStages } from '@/api/stages'
import { getMe } from '@/api/auth'
import { getLeaderboard } from '@/api/leaderboard'
import Leaderboard from '@/components/Leaderboard'
import type { StageKey, StageResponse, UserProfile, RewardKey, LeaderboardEntry } from '@/types'

const STAGE_KEYS = ['D', 'M_A', 'I', 'C'] as const

const STAGE_SLUG: Record<StageKey, string> = {
  D: 'd', M_A: 'ma', I: 'i', C: 'c',
}

type StatusVariant = 'draft' | 'submitted' | 'approved' | 'rejected'
const STATUS_VARIANT: Record<string, StatusVariant> = {
  DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved', REJECTED: 'rejected',
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stages, setStages]   = useState<StageResponse[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyStages(), getMe(), getLeaderboard()])
      .then(([s, p, l]) => { setStages(s); setProfile(p); setLeaderboard(l) })
      .finally(() => setLoading(false))
  }, [])

  const totalBarrels = stages.reduce((sum, s) => sum + s.barrels, 0)
  const reward: RewardKey =
    totalBarrels >= 16 ? 'JAPAN_TRIP' :
    totalBarrels >= 12 ? 'LEADERSHIP_AWARD' :
    totalBarrels >= 8  ? 'BRANDED_MERCH' : 'PROJECT_BADGE'

  if (loading) {
    return (
      <Layout>
        <motion.div
          className="flex items-center justify-center py-32 text-ink-tertiary text-body"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Загрузка...
        </motion.div>
      </Layout>
    )
  }

  const initials = profile?.fullName
    ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '??'

  return (
    <Layout>
      {/* Profile header */}
      <motion.div
        className="flex items-center gap-6 mb-10 p-6 rounded-2xl bg-s1/50 backdrop-blur-xl border border-hl shadow-sm relative overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-accent/20 shadow-lg">
            <AvatarImage src={profile?.avatarUrl ?? ''} alt={profile?.fullName} />
            <AvatarFallback className="text-xl font-bold bg-s2 text-ink">{initials}</AvatarFallback>
          </Avatar>
          <Link
            to="/dashboard/avatar"
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-s1 border-2 border-hl flex items-center justify-center hover:bg-s2 hover:border-accent hover:text-accent transition-all shadow-sm"
          >
            <Camera size={14} className="text-ink-subtle" />
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-ink mb-1 tracking-tight">{profile?.fullName}</h1>
          {profile?.position && (
            <p className="text-body text-ink-subtle">{profile.position}</p>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-card-title text-ink">Этапы DMAIC</h2>
            <p className="eyebrow">{stages.length} / 4</p>
          </div>

          {STAGE_KEYS.map((key, i) => {
            const existing = stages.find((s) => s.stage === key)
            if (existing) {
              return <StageCard key={key} stage={existing} index={i} />
            }
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
              >
                <div className="card flex items-center gap-4 opacity-50">
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-s2 border border-hl-strong flex items-center justify-center ring-1 ring-hl/40 ring-offset-1 ring-offset-s1">
                    <span className="text-sm font-semibold text-ink-subtle leading-none">
                      {key === 'M_A' ? 'M/A' : key}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-medium text-ink">{t(`stage.${key}`)}</p>
                    <p className="text-caption text-ink-tertiary">Не начат</p>
                  </div>
                  <Link
                    to={`/dashboard/stage/${STAGE_SLUG[key]}`}
                    className="btn-secondary text-caption flex items-center gap-1.5 shrink-0"
                  >
                    <Plus size={12} />
                    Начать
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <BarrelProgress totalBarrels={totalBarrels} reward={reward} />

          {/* Progress status card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="bg-s1/50 backdrop-blur-md border border-hl/50">
              <CardHeader className="pb-2">
                <CardTitle className="eyebrow text-ink-subtle">Прогресс</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {STAGE_KEYS.map((key) => {
                  const s = stages.find((x) => x.stage === key)
                  const status = s?.status ?? 'DRAFT'
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-caption text-ink-subtle">{t(`stage.${key}`)}</span>
                      <Badge variant={STATUS_VARIANT[status]}>
                        {t(`stage.status.${status}`)}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-ink tracking-tight">{t('leaderboard.title')}</h2>
          <Badge variant="default" className="bg-s2 text-ink-subtle border border-hl">Топ участников</Badge>
        </div>
        <div className="rounded-2xl border border-hl/50 shadow-sm overflow-hidden bg-s1">
          <Leaderboard entries={leaderboard} />
        </div>
      </motion.div>
    </Layout>
  )
}
