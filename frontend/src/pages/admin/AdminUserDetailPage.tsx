import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileEdit,
  FileText,
  FileSpreadsheet,
  Image,
  File,
  Download,
  Loader2,
  MessageSquare
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { getAllUsers, getUserStages, reviewStage, rejectStage } from '@/api/admin'
import type { StageResponse, UserProfile } from '@/types'

const STAGE_KEYS = ['D', 'M_A', 'I', 'C'] as const
const STAGE_LABELS: Record<string, string> = {
  D: 'Define (Определение)',
  M_A: 'Measure & Analyze (Измерение и Анализ)',
  I: 'Improve (Улучшение)',
  C: 'Control (Контроль)'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function getFileIcon(contentType: string) {
  if (contentType === 'application/pdf') return <FileText size={16} />
  if (contentType.includes('word') || contentType.includes('document')) return <FileText size={16} />
  if (contentType.includes('sheet') || contentType.includes('excel')) return <FileSpreadsheet size={16} />
  if (contentType.startsWith('image/')) return <Image size={16} />
  return <File size={16} />
}

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const uId = Number(userId)

  const [user, setUser] = useState<UserProfile | null>(null)
  const [stages, setStages] = useState<StageResponse[]>([])
  const [loading, setLoading] = useState(true)

  // Review states
  const [scores, setScores] = useState<Record<number, { score: number; comment: string }>>({})
  const [saving, setSaving] = useState<number | null>(null)
  const [confirm, setConfirm] = useState<number | null>(null)
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [rejectComment, setRejectComment] = useState('')
  const [rejecting, setRejecting] = useState(false)

  useEffect(() => {
    if (!uId) return
    Promise.all([
      getAllUsers().then(users => users.find(u => u.id === uId) || null),
      getUserStages(uId)
    ])
      .then(([u, s]) => {
        setUser(u)
        setStages(s)
      })
      .finally(() => setLoading(false))
  }, [uId])

  const handleReview = async (stageId: number) => {
    const entry = scores[stageId]
    if (!entry) return
    setSaving(stageId)
    setConfirm(null)
    try {
      const updated = await reviewStage(stageId, entry.score, entry.comment)
      setStages((p) => p.map((s) => (s.id === stageId ? updated : s)))
    } finally {
      setSaving(null)
    }
  }

  const handleReject = async () => {
    if (rejectId === null) return
    setRejecting(true)
    try {
      const updated = await rejectStage(rejectId, rejectComment)
      setStages((p) => p.map((s) => (s.id === rejectId ? updated : s)))
      setRejectId(null)
      setRejectComment('')
    } finally {
      setRejecting(false)
    }
  }

  const setField = (id: number, field: 'score' | 'comment', val: number | string) =>
    setScores((p) => ({ ...p, [id]: { score: p[id]?.score ?? 0, comment: p[id]?.comment ?? '', [field]: val } }))

  if (loading) {
    return (
      <AdminLayout breadcrumbs={[{ label: 'Участники', path: '/admin/users' }, { label: 'Загрузка...' }]}>
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-ink-tertiary" size={24} /></div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout breadcrumbs={[{ label: 'Участники', path: '/admin/users' }, { label: 'Не найдено' }]}>
        <div className="py-32 text-center text-ink-subtle">Пользователь не найден</div>
      </AdminLayout>
    )
  }

  const totalBarrels = stages.reduce((sum, s) => sum + (s.barrels || 0), 0)

  return (
    <AdminLayout
      breadcrumbs={[
        { label: 'Участники', path: '/admin/users' },
        { label: user.fullName }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <Link to="/admin/users" className="flex items-center gap-2 text-sm text-ink-tertiary hover:text-ink mb-6 transition-colors">
          <ArrowLeft size={14} /> К списку участников
        </Link>

        {/* User Profile Header */}
        <motion.div
          className="flex items-center gap-6 mb-8 p-6 bg-s1 border border-hl rounded-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Avatar className="h-20 w-20 border border-hl shadow-sm">
            <AvatarImage src={user.avatarUrl ?? ''} alt={user.fullName} />
            <AvatarFallback className="text-xl font-bold">
              {user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-ink mb-1">{user.fullName}</h1>
            <p className="text-ink-tertiary flex items-center gap-3">
              {user.position || 'Должность не указана'}
              <span className="w-1 h-1 bg-hl-strong rounded-full" />
              <code className="text-xs">{user.username}</code>
            </p>
          </div>
          <div className="text-right">
            <p className="text-caption text-ink-subtle uppercase tracking-wider font-semibold mb-1">Всего баррелей</p>
            <span className="barrel text-xl w-14 h-14 shadow-sm">{totalBarrels}</span>
          </div>
        </motion.div>

        {/* Stages Timeline */}
        <div className="space-y-6">
          {STAGE_KEYS.map((key, idx) => {
            const stage = stages.find(s => s.stage === key)
            
            if (!stage) {
              return (
                <Card key={key} className="opacity-60 border-dashed bg-transparent">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-s2 flex items-center justify-center text-ink-tertiary font-bold">
                      {key.replace('_', '/')}
                    </div>
                    <div>
                      <h3 className="text-body font-medium text-ink-subtle">{STAGE_LABELS[key]}</h3>
                      <p className="text-caption text-ink-tertiary">К этапу еще не приступали</p>
                    </div>
                  </CardContent>
                </Card>
              )
            }

            const currentScore = scores[stage.id]?.score ?? 0

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`overflow-hidden border ${stage.status === 'SUBMITTED' ? 'border-accent shadow-sm ring-1 ring-accent/10' : 'border-hl'}`}>
                  {/* Header */}
                  <div className={`p-5 flex items-start justify-between border-b ${stage.status === 'SUBMITTED' ? 'bg-accent/5 border-accent/20' : 'bg-s2/30 border-hl'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        stage.status === 'APPROVED' ? 'bg-success/20 text-success' :
                        stage.status === 'SUBMITTED' ? 'bg-accent text-white shadow-md' :
                        stage.status === 'REJECTED' ? 'bg-danger/20 text-danger' :
                        'bg-s2 text-ink-tertiary border border-hl'
                      }`}>
                        {key.replace('_', '/')}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-ink">{STAGE_LABELS[key]}</h3>
                          <Badge variant={stage.status === 'APPROVED' ? 'approved' : stage.status === 'REJECTED' ? 'rejected' : stage.status === 'SUBMITTED' ? 'submitted' : 'draft'}>
                            {stage.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-caption text-ink-tertiary">
                          {stage.submittedAt && (
                            <span className="flex items-center gap-1.5"><Clock size={12} /> Отправлено: {new Date(stage.submittedAt).toLocaleDateString()}</span>
                          )}
                          {stage.reviewedAt && (
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Проверено: {new Date(stage.reviewedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {stage.adminScore !== null && (
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-2xl font-bold text-ink">{stage.adminScore}%</span>
                          <span className="barrel w-8 h-8 text-sm">{stage.barrels}</span>
                        </div>
                        <p className="text-caption text-ink-subtle mt-0.5">Оценка администратора</p>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Full Content view */}
                    {Object.keys(stage.content ?? {}).length > 0 ? (
                      <div className="space-y-5 mb-6">
                        {Object.entries(stage.content ?? {}).map(([k, v]) => (
                          <div key={k} className="bg-s2/30 rounded-lg p-4 border border-hl/50">
                            <h4 className="text-sm font-semibold text-ink-subtle mb-2 flex items-center gap-2">
                              <FileEdit size={14} /> {k}
                            </h4>
                            <p className="text-body text-ink whitespace-pre-wrap leading-relaxed">{String(v)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-ink-tertiary text-sm mb-6">Текст не заполнен.</p>
                    )}

                    {/* Files */}
                    {(stage.files?.length ?? 0) > 0 && (
                      <div className="mb-6 pt-5 border-t border-hl/50">
                        <h4 className="text-sm font-semibold text-ink-subtle mb-3 flex items-center gap-2">
                          <Download size={14} /> Прикрепленные файлы ({stage.files.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {stage.files.map((file) => (
                            <a
                              key={file.id}
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-s1 rounded-xl border border-hl hover:border-hl-strong hover:bg-s2 transition-all group shadow-sm"
                            >
                              <div className="p-2 rounded-lg bg-canvas text-ink-tertiary group-hover:text-accent transition-colors">
                                {getFileIcon(file.contentType)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-ink truncate group-hover:text-accent transition-colors">{file.fileName}</p>
                                <p className="text-xs text-ink-tertiary">{formatFileSize(file.fileSize)}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Comment (if exists and not currently reviewing) */}
                    {stage.adminComment && stage.status !== 'SUBMITTED' && (
                      <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-3">
                        <MessageSquare size={16} className="text-accent mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-accent mb-1">Ваш комментарий участнику</p>
                          <p className="text-sm text-ink-muted leading-relaxed">{stage.adminComment}</p>
                        </div>
                      </div>
                    )}

                    {/* Review Panel (only if SUBMITTED) */}
                    {stage.status === 'SUBMITTED' && (
                      <div className="mt-6 pt-6 border-t border-accent/20 bg-canvas/30 -mx-6 -mb-6 p-6">
                        <h4 className="text-lg font-semibold text-ink mb-4">Проверка работы</h4>
                        
                        <div className="space-y-5">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <Label className="text-sm font-medium">Оценка ({currentScore}%)</Label>
                              <div className="flex items-center gap-2 text-sm">
                                Ожидаемые баррели: 
                                <span className="barrel w-6 h-6 text-xs inline-flex items-center justify-center">
                                  {currentScore >= 100 ? 5 : currentScore >= 80 ? 4 : currentScore >= 50 ? 2 : currentScore >= 40 ? 1 : 0}
                                </span>
                              </div>
                            </div>
                            <Slider
                              min={0} max={100} step={1}
                              value={currentScore}
                              onChange={(v) => setField(stage.id, 'score', v)}
                              className="py-2"
                            />
                            <div className="flex justify-between text-xs text-ink-tertiary mt-1">
                              <span>0%</span>
                              <span className="text-danger">40%</span>
                              <span className="text-barrel">80%</span>
                              <span className="text-success">100%</span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">Комментарий (опционально)</Label>
                            <Input
                              value={scores[stage.id]?.comment ?? ''}
                              onChange={(e) => setField(stage.id, 'comment', e.target.value)}
                              placeholder="Напишите отзыв о проделанной работе..."
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            <Button
                              onClick={() => setConfirm(stage.id)}
                              disabled={saving === stage.id || !scores[stage.id]?.score}
                              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2"
                            >
                              {saving === stage.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                              Одобрить и начислить баррели
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => { setRejectId(stage.id); setRejectComment('') }}
                              className="w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                              <RotateCcw size={16} />
                              Вернуть на доработку
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirm !== null} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердить оценку</DialogTitle>
            <DialogDescription>
              {confirm !== null && (
                <>Оценка <strong>{scores[confirm]?.score ?? 0}%</strong>. Действие нельзя отменить.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirm(null)}>Отмена</Button>
            <Button onClick={() => confirm !== null && handleReview(confirm)}>Подтвердить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={rejectId !== null} onOpenChange={() => setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отправить на доработку</DialogTitle>
            <DialogDescription>
              Этап будет возвращён участнику. Обязательно укажите причину.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <Label>Причина возврата</Label>
            <textarea
              rows={3}
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Опишите, что нужно исправить..."
              className="textarea mt-1.5 w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectId(null)}>Отмена</Button>
            <Button
              onClick={handleReject}
              disabled={rejecting || !rejectComment.trim()}
              variant="danger"
            >
              {rejecting ? <Loader2 size={14} className="animate-spin" /> : 'Вернуть участнику'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
