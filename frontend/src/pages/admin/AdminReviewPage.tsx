import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  Loader2, RotateCcw, Download,
  FileText, FileSpreadsheet, Image, File, User,
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { getSubmittedStages, reviewStage, rejectStage } from '@/api/admin'
import type { StageResponse } from '@/types'

type StatusVariant = 'draft' | 'submitted' | 'approved' | 'rejected'
const STATUS_VARIANT: Record<string, StatusVariant> = {
  DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved', REJECTED: 'rejected',
}

function barrelsForScore(score: number): number {
  if (score >= 100) return 5
  if (score >= 80)  return 4
  if (score >= 50)  return 2
  if (score >= 40)  return 1
  return 0
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

export default function AdminReviewPage() {
  const { userId } = useParams<{ userId: string }>()
  const { t } = useTranslation()

  const [stages, setStages]     = useState<StageResponse[]>([])
  const [scores, setScores]     = useState<Record<number, { score: number; comment: string }>>({})
  const [saving, setSaving]     = useState<number | null>(null)
  const [confirm, setConfirm]   = useState<number | null>(null)
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [rejectComment, setRejectComment] = useState('')
  const [rejecting, setRejecting] = useState(false)

  useEffect(() => {
    getSubmittedStages().then(setStages)
  }, [userId])

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

  return (
    <AdminLayout breadcrumbs={[{ label: 'Очередь проверки' }]}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Этапы на согласовании</h1>
          <p className="text-caption text-ink-subtle mt-1">Ожидают вашей проверки и оценки</p>
        </div>
      </div>

      {stages.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-body-lg text-ink-subtle mb-1">Нет этапов на проверке</p>
          <p className="text-caption text-ink-tertiary">Участники ещё не отправили свои этапы</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {stages.map((stage, i) => {
            const currentScore = scores[stage.id]?.score ?? 0
            const previewBarrels = barrelsForScore(currentScore)

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-4 border-b border-hl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={STATUS_VARIANT[stage.status]}>
                            {t(`stage.status.${stage.status}`)}
                          </Badge>
                          {stage.ownerFullName && (
                            <span className="text-caption font-semibold text-accent bg-accent/15 border border-accent/25 px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                              <User size={11} className="stroke-[2.5]" />
                              {stage.ownerFullName}
                            </span>
                          )}
                        </div>
                        <h3 className="text-card-title text-ink mt-1.5">{t(`stage.${stage.stage}`)}</h3>
                        {stage.submittedAt && (
                          <p className="text-caption text-ink-tertiary mt-1">
                            Отправлено: {new Date(stage.submittedAt).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                      </div>
                      {stage.adminScore !== null && (
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="barrel">{stage.barrels}</div>
                          <div className="text-right">
                            <p className="text-headline font-semibold text-ink">{stage.adminScore}%</p>
                            <p className="text-caption text-ink-tertiary">оценка</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-5">
                    {/* Content fields */}
                    {Object.keys(stage.content ?? {}).length > 0 && (
                      <div className="space-y-3 mb-6">
                        {Object.entries(stage.content ?? {}).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-caption text-ink-tertiary mb-0.5">{k}</p>
                            <p className="text-body text-ink-muted leading-relaxed">{String(v)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Attached files */}
                    {(stage.files?.length ?? 0) > 0 && (
                      <div className="mb-6 pt-4 border-t border-hl">
                        <p className="text-caption text-ink-subtle font-medium mb-3">
                          {t('admin.attachments')} ({stage.files.length})
                        </p>
                        <div className="space-y-2">
                          {stage.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center gap-3 p-3 bg-s2 rounded-lg border border-hl"
                            >
                              <span className="text-ink-subtle shrink-0">{getFileIcon(file.contentType)}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-body text-ink truncate">{file.fileName}</p>
                                <p className="text-caption text-ink-tertiary">{formatFileSize(file.fileSize)}</p>
                              </div>
                              {file.contentType.startsWith('image/') && (
                                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                  <img
                                    src={file.fileUrl}
                                    alt={file.fileName}
                                    className="w-12 h-12 rounded object-cover border border-hl"
                                  />
                                </a>
                              )}
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 text-ink-tertiary hover:text-accent transition-colors"
                                title={t('admin.download')}
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Review panel */}
                    <div className="pt-5 border-t border-hl space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{t('admin.score')}</Label>
                          <div className="flex items-center gap-2">
                            <span className="text-headline font-semibold text-ink" style={{ letterSpacing: '-0.02em' }}>
                              {currentScore}%
                            </span>
                            <span className="barrel w-7 h-7 text-xs">{previewBarrels}</span>
                          </div>
                        </div>
                        <Slider
                          min={0} max={100} step={1}
                          value={currentScore}
                          onChange={(v) => setField(stage.id, 'score', v)}
                          className="py-2"
                        />
                        <div className="flex justify-between text-caption text-ink-tertiary">
                          <span>0%</span>
                          <span className="text-danger">40%</span>
                          <span className="text-barrel">80%</span>
                          <span className="text-success">100%</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`comment-${stage.id}`}>{t('admin.comment')}</Label>
                        <Input
                          id={`comment-${stage.id}`}
                          type="text"
                          value={scores[stage.id]?.comment ?? ''}
                          onChange={(e) => setField(stage.id, 'comment', e.target.value)}
                          placeholder="Комментарий для участника..."
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => setConfirm(stage.id)}
                          disabled={saving === stage.id || !scores[stage.id]?.score}
                          className="flex-1 sm:flex-initial"
                        >
                          {saving === stage.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : t('admin.approve')}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => { setRejectId(stage.id); setRejectComment('') }}
                          className="flex items-center gap-2"
                        >
                          <RotateCcw size={14} />
                          {t('admin.reject')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Confirm dialog */}
      <Dialog open={confirm !== null} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердить оценку</DialogTitle>
            <DialogDescription>
              {confirm !== null && (
                <>Оценка <strong>{scores[confirm]?.score ?? 0}%</strong> — {barrelsForScore(scores[confirm]?.score ?? 0)} баррелей. Действие нельзя отменить.</>
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
            <DialogTitle>{t('admin.rejectTitle')}</DialogTitle>
            <DialogDescription>
              Этап будет возвращён участнику на доработку. Укажите причину.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <Label htmlFor="reject-comment">{t('admin.rejectComment')}</Label>
            <textarea
              id="reject-comment"
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
              className="bg-danger hover:bg-danger/90 text-white"
            >
              {rejecting ? <Loader2 size={14} className="animate-spin" /> : t('admin.rejectConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
