import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  Users, Send, CheckCircle2, RotateCcw,
  FileEdit, ArrowRight, TrendingUp, BarChart3, Eye,
  Clock, FileText, Loader2,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAdminDashboard, getSubmittedStages } from '@/api/admin'
import type { AdminDashboard, StageResponse } from '@/types'

const STAGE_KEYS = ['D', 'M_A', 'I', 'C'] as const
const STAGE_LABELS: Record<string, string> = { D: 'D', M_A: 'M/A', I: 'I', C: 'C' }

export default function AdminDashboardPage() {
  const { t } = useTranslation()

  const [data, setData] = useState<AdminDashboard | null>(null)
  const [allStages, setAllStages] = useState<StageResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAdminDashboard(), getSubmittedStages()])
      .then(([dashboard, stages]) => {
        setData(dashboard)
        setAllStages(stages)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <AdminLayout title={t('admin.dashboard')}>
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-ink-tertiary" size={24} /></div>
      </AdminLayout>
    )
  }

  if (!data) return null

  const totalPossibleStages = data.totalParticipants * 4
  const totalCompleted = data.totalStagesApproved
  const approvedPct = totalPossibleStages > 0 ? Math.round((totalCompleted / totalPossibleStages) * 100) : 0

  const statCards = [
    { label: t('admin.statsTotal'),     value: data.totalParticipants, icon: Users,       description: 'зарегистрировано' },
    { label: t('admin.statsSubmitted'), value: data.totalStagesSubmitted, icon: Send,     description: 'ожидают проверки' },
    { label: t('admin.statsApproved'),  value: data.totalStagesApproved, icon: CheckCircle2, description: 'этапов завершено' },
    { label: t('admin.statsRejected'),  value: data.totalStagesRejected, icon: RotateCcw, description: 'на доработке' },
    { label: t('admin.statsDraft'),     value: data.totalStagesDraft, icon: FileEdit,     description: 'в работе' },
  ]

  // Compute stage-level stats for mini chart
  const stageStats = STAGE_KEYS.map((key) => {
    let approved = 0, submitted = 0, rejected = 0, draft = 0, notStarted = 0
    data.participants.forEach((p) => {
      const s = p.stages.find((st) => st.stage === key)
      if (!s) { notStarted++; return }
      switch (s.status) {
        case 'APPROVED': approved++; break
        case 'SUBMITTED': submitted++; break
        case 'REJECTED': rejected++; break
        case 'DRAFT': draft++; break
      }
    })
    return { key, approved, submitted, rejected, draft, notStarted }
  })

  return (
    <AdminLayout title={t('admin.dashboard')}>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-ink">{t('admin.overallProgress')}</h1>
        </div>
        <Link to="/admin/review/all">
          <Button variant="secondary" className="flex items-center gap-2">
            <Eye size={14} />
            Проверить этапы
          </Button>
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <Card className="p-4 hover:bg-s2 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-caption text-ink-subtle">{stat.label}</p>
                <stat.icon size={16} className="text-ink-tertiary" />
              </div>
              <p className="text-2xl font-semibold text-ink" style={{ letterSpacing: '-0.02em' }}>
                {stat.value}
              </p>
              <p className="text-caption text-ink-tertiary mt-0.5">{stat.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress + Stage breakdown row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Overall progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-ink-tertiary" />
                <p className="text-body font-medium text-ink">{t('admin.overallProgress')}</p>
              </div>
            </div>
            <div className="flex items-end gap-4 mb-4">
              <span className="text-4xl font-semibold text-ink" style={{ letterSpacing: '-0.03em' }}>
                {approvedPct}%
              </span>
              <span className="text-caption text-ink-tertiary pb-1.5">
                {totalCompleted} из {totalPossibleStages} этапов
              </span>
            </div>
            <div className="h-2.5 bg-s2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-ink rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${approvedPct}%` }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-caption text-ink-tertiary">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" /> Одобрено: {data.totalStagesApproved}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ink" /> На проверке: {data.totalStagesSubmitted}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-danger" /> На доработке: {data.totalStagesRejected}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Stage breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-ink-tertiary" />
              <p className="text-body font-medium text-ink">Статистика по этапам</p>
            </div>
            <div className="space-y-4">
              {stageStats.map((st) => {
                const total = data.totalParticipants
                const approvedW = total > 0 ? (st.approved / total) * 100 : 0
                const submittedW = total > 0 ? (st.submitted / total) * 100 : 0
                const rejectedW = total > 0 ? (st.rejected / total) * 100 : 0
                const draftW = total > 0 ? (st.draft / total) * 100 : 0

                return (
                  <div key={st.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-body font-medium text-ink">{STAGE_LABELS[st.key]}</span>
                      <span className="text-caption text-ink-tertiary">
                        {st.approved}/{total} одобрено
                      </span>
                    </div>
                    <div className="h-2 bg-s2 rounded-full overflow-hidden flex">
                      {approvedW > 0 && <div className="h-full bg-success" style={{ width: `${approvedW}%` }} />}
                      {submittedW > 0 && <div className="h-full bg-ink" style={{ width: `${submittedW}%` }} />}
                      {rejectedW > 0 && <div className="h-full bg-danger" style={{ width: `${rejectedW}%` }} />}
                      {draftW > 0 && <div className="h-full bg-ink-tertiary/30" style={{ width: `${draftW}%` }} />}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Analytics and Top Participants Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Top Participants */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="border-b border-hl pb-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ink-tertiary" />
                <CardTitle className="text-card-title">Топ участников</CardTitle>
              </div>
              <CardDescription>Сортировка по заработанным баррелям</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-hl">
                {[...data.participants].sort((a, b) => b.totalBarrels - a.totalBarrels).slice(0, 5).map((p, i) => (
                  <Link
                    key={p.userId}
                    to={`/admin/users/${p.userId}`}
                    className="flex items-center gap-4 p-4 hover:bg-s2 transition-colors"
                  >
                    <div className="w-6 text-center font-bold text-ink-tertiary">#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-medium text-ink truncate">{p.fullName}</p>
                      {p.position && <p className="text-caption text-ink-tertiary truncate">{p.position}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-ink">{p.totalBarrels}</span>
                      <span className="barrel w-5 h-5 text-[10px] inline-flex items-center justify-center">Б</span>
                    </div>
                  </Link>
                ))}
                {data.participants.length === 0 && (
                  <div className="p-8 text-center text-ink-tertiary">Нет данных</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Scores */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-hl pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-ink-tertiary" />
                <CardTitle className="text-card-title">Средние оценки</CardTitle>
              </div>
              <CardDescription>Общая успеваемость по этапам</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center p-6">
              {(() => {
                const allScores = data.participants.flatMap(p => p.stages).filter(s => s.score != null).map(s => s.score as number)
                const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0
                return (
                  <div className="text-center mb-8">
                    <span className="text-5xl font-bold text-ink mb-2 block">{avgScore}%</span>
                    <span className="text-caption text-ink-tertiary">Средний балл по проекту</span>
                  </div>
                )
              })()}
              
              <div className="space-y-3">
                {STAGE_KEYS.map((key) => {
                  const scores = data.participants.flatMap(p => p.stages).filter(s => s.stage === key && s.score != null).map(s => s.score as number)
                  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-caption font-medium text-ink-subtle">{STAGE_LABELS[key]}</span>
                      <div className="flex-1 mx-4 h-1.5 bg-s2 rounded-full overflow-hidden">
                        <div className="h-full bg-ink" style={{ width: `${avg}%` }} />
                      </div>
                      <span className="text-caption font-semibold text-ink w-8 text-right">{avg}%</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recently submitted */}
      {allStages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Card>
            <CardHeader className="border-b border-hl">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-card-title">
                    <Clock size={16} className="text-ink-tertiary" /> Последние отправленные
                  </CardTitle>
                  <CardDescription className="mt-1">Этапы ожидающие вашей проверки</CardDescription>
                </div>
                <Link to="/admin/review/all">
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1">
                    Смотреть все <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-hl">
                {allStages.slice(0, 5).map((stage) => (
                  <Link
                    key={stage.id}
                    to={`/admin/users/${stage.ownerId}`}
                    className="flex items-center gap-4 p-4 hover:bg-s2 transition-colors"
                  >
                    <Badge variant="submitted">{t(`stage.status.${stage.status}`)}</Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-medium text-ink truncate">
                        {stage.ownerFullName} <span className="text-ink-tertiary font-normal">· {t(`stage.${stage.stage}`)}</span>
                      </p>
                      {stage.submittedAt && (
                        <p className="text-caption text-ink-tertiary">
                          {new Date(stage.submittedAt).toLocaleDateString('ru-RU')} в {new Date(stage.submittedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    {(stage.files?.length ?? 0) > 0 && (
                      <span className="text-caption text-ink-tertiary flex items-center gap-1 mr-2">
                        <FileText size={12} /> {stage.files.length}
                      </span>
                    )}
                    <ArrowRight size={14} className="text-ink-tertiary" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AdminLayout>
  )
}
