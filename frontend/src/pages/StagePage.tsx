import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft, CheckCircle2, Loader2, Send, Lock,
  Trash2, FileText, FileSpreadsheet, Image, AlertCircle,
  CloudUpload, File,
} from 'lucide-react'
import Layout from '@/components/Layout'
import { getMyStages, saveStageContent, submitStage, uploadStageFile, deleteStageFile } from '@/api/stages'
import type { StageKey, StageResponse, StageFileInfo } from '@/types'

const STAGE_FIELDS: Record<StageKey, { label: string; hint: string }[]> = {
  D: [
    { label: 'Описание проблемы',           hint: 'Опишите суть проблемы и её причины' },
    { label: 'Желаемый результат',           hint: 'Какой результат ожидается по завершении' },
    { label: 'Ключевые компоненты качества', hint: 'Что определяет качество в данном процессе' },
  ],
  M_A: [
    { label: 'План сбора данных',       hint: 'Как и какие данные будут собираться' },
    { label: 'Метрики производительности', hint: 'Какие показатели будут отслеживаться' },
    { label: 'Карта процесса',          hint: 'Описание текущего процесса' },
    { label: 'Первопричина проблемы',   hint: 'Выявленная первопричина по данным анализа' },
  ],
  I: [
    { label: 'Предлагаемые решения',    hint: 'Креативные решения для устранения проблемы' },
    { label: 'Результаты тестирования', hint: 'Как было протестировано решение' },
    { label: 'Внедрённые изменения',    hint: 'Что было реализовано' },
  ],
  C: [
    { label: 'План мониторинга',     hint: 'Как будет контролироваться результат' },
    { label: 'Ожидаемые результаты', hint: 'Снижение затрат, рост производительности и т.д.' },
    { label: 'Дата завершения',      hint: 'Планируемая дата финального отчёта' },
  ],
}

function slugToStage(slug: string): StageKey {
  const map: Record<string, StageKey> = { d: 'D', ma: 'M_A', i: 'I', c: 'C' }
  return map[slug] ?? 'D'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function getFileIcon(contentType: string) {
  if (contentType === 'application/pdf') return <FileText size={18} />
  if (contentType.includes('word') || contentType.includes('document')) return <FileText size={18} />
  if (contentType.includes('sheet') || contentType.includes('excel')) return <FileSpreadsheet size={18} />
  if (contentType.startsWith('image/')) return <Image size={18} />
  return <File size={18} />
}

export default function StagePage() {
  const { stage: slug = 'd' } = useParams<{ stage: string }>()
  const stageKey = slugToStage(slug)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stageData, setStageData] = useState<StageResponse | null>(null)
  const [fields, setFields]       = useState<Record<string, string>>({})
  const [saving, setSaving]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved]         = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver]   = useState(false)
  const [fileError, setFileError] = useState('')

  useEffect(() => {
    getMyStages().then((stages) => {
      const s = stages.find((x) => x.stage === stageKey)
      if (s) {
        setStageData(s)
        setFields(Object.fromEntries(
          Object.entries(s.content ?? {}).map(([k, v]) => [k, String(v)])
        ))
      }
    })
  }, [stageKey])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await saveStageContent(stageKey, fields)
      setStageData(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitStage(stageKey)
      navigate('/dashboard')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setFileError('')
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          setFileError(`Файл "${file.name}" превышает 10 МБ`)
          continue
        }
        const uploaded = await uploadStageFile(stageKey, file)
        setStageData((prev) => prev ? {
          ...prev,
          files: [...(prev.files ?? []), uploaded as unknown as StageFileInfo],
        } : prev)
      }
    } catch {
      setFileError('Ошибка при загрузке файла')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId: number) => {
    try {
      await deleteStageFile(stageKey, fileId)
      setStageData((prev) => prev ? {
        ...prev,
        files: prev.files.filter((f) => f.id !== fileId),
      } : prev)
    } catch {
      setFileError('Ошибка при удалении файла')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const locked = stageData?.status === 'APPROVED' || stageData?.status === 'SUBMITTED'
  const rejected = stageData?.status === 'REJECTED'

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-caption text-ink-tertiary hover:text-ink-subtle mb-8 transition-colors"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: -2 }}
        >
          <ArrowLeft size={13} />
          Мой кабинет
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-2">
            <p className="eyebrow">{t(`stage.status.${stageData?.status ?? 'DRAFT'}`)}</p>
            {locked && <Lock size={11} className="text-ink-tertiary" />}
          </div>
          <h1 className="text-headline text-ink mb-3">{t(`stage.${stageKey}`)}</h1>

          {/* Rejection notice */}
          {rejected && stageData?.adminComment && (
            <motion.div
              className="flex items-start gap-3 p-4 bg-danger/10 border border-danger/20 rounded-lg mb-4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle size={20} className="text-danger shrink-0 mt-0.5" />
              <div>
                <p className="text-body font-medium text-danger mb-1">{t('stage.rejectedNotice')}</p>
                <p className="text-caption text-ink-muted">{stageData.adminComment}</p>
              </div>
            </motion.div>
          )}

          {stageData?.adminScore !== null && stageData?.adminScore !== undefined && (
            <motion.div
              className="flex items-center gap-4 p-5 bg-s1/80 backdrop-blur-md border border-hl rounded-2xl shadow-lg mb-8"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <div className={`absolute inset-0 rounded-full blur-xl ${Number(stageData.barrels) >= 5 ? 'bg-accent/30' : 'bg-ink/5'}`}></div>
                <span className={`relative z-10 text-3xl font-bold ${Number(stageData.barrels) >= 5 ? 'text-accent drop-shadow-[0_0_12px_rgba(91,141,238,0.8)]' : 'text-ink'}`}>
                  {stageData.barrels}
                </span>
              </div>
              <div>
                <p 
                  className={`text-3xl font-bold transition-all duration-300 ${stageData.adminScore >= 80 ? 'text-accent drop-shadow-[0_0_12px_rgba(91,141,238,0.4)]' : 'text-ink'}`} 
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {stageData.adminScore}%
                </p>
                <p className="text-caption text-ink-subtle uppercase tracking-wider mt-0.5">Оценка администратора</p>
              </div>
              {stageData.adminComment && !rejected && (
                <p className="text-sm text-ink-muted border-l border-hl pl-5 ml-4 flex-1">
                  {stageData.adminComment}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Fields */}
        <motion.div
          className="bg-s1/60 backdrop-blur-2xl border border-hl/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-8 space-y-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          {STAGE_FIELDS[stageKey].map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <label className="block text-lg font-semibold text-ink mb-3">{field.label}</label>
              <textarea
                rows={4}
                value={fields[field.label] ?? ''}
                onChange={(e) => setFields((p) => ({ ...p, [field.label]: e.target.value }))}
                disabled={locked}
                placeholder={locked ? '' : field.hint}
                className="w-full bg-canvas/50 border border-hl rounded-xl p-4 text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-ink/30 focus:ring-1 focus:ring-ink/30 transition-all resize-none shadow-inner"
              />
            </motion.div>
          ))}

          {/* File upload section */}
          {!locked && (
            <motion.div
              className="pt-5 border-t border-hl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-caption text-ink-subtle mb-3 font-medium">{t('admin.attachments')}</p>

              {/* Drop zone */}
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                  transition-colors duration-150
                  ${dragOver ? 'border-accent bg-accent/5' : 'border-hl hover:border-ink-tertiary'}
                  ${(stageData?.files?.length ?? 0) >= 5 ? 'opacity-50 pointer-events-none' : ''}
                `}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.docx,.xlsx,.doc,.xls,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                {uploading ? (
                  <Loader2 size={24} className="animate-spin text-accent mx-auto" />
                ) : (
                  <>
                    <CloudUpload size={28} className="text-ink-tertiary mx-auto mb-2" />
                    <p className="text-caption text-ink-subtle">{t('admin.dropFiles')}</p>
                    <p className="text-caption text-ink-tertiary mt-1">{t('admin.fileLimit')}</p>
                  </>
                )}
              </div>

              {fileError && (
                <p className="text-caption text-danger mt-2">{fileError}</p>
              )}
            </motion.div>
          )}

          {/* Uploaded files list */}
          {(stageData?.files?.length ?? 0) > 0 && (
            <div className="space-y-2">
              {locked && (
                <p className="text-caption text-ink-subtle font-medium mb-2">{t('admin.attachments')}</p>
              )}
              {stageData!.files.map((file) => (
                <motion.div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-s2 rounded-lg border border-hl group"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-ink-subtle shrink-0">{getFileIcon(file.contentType)}</span>
                  <div className="flex-1 min-w-0">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-ink hover:text-accent transition-colors truncate block"
                    >
                      {file.fileName}
                    </a>
                    <p className="text-caption text-ink-tertiary">{formatFileSize(file.fileSize)}</p>
                  </div>
                  {!locked && (
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-ink-tertiary hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                      title={t('admin.deleteFile')}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          {(!locked || rejected) && (
            <div className="flex items-center gap-3 pt-2 border-t border-hl">
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {saving ? (
                    <motion.span key="saving"><Loader2 size={14} className="animate-spin" /></motion.span>
                  ) : saved ? (
                    <motion.span key="saved" className="flex items-center gap-1.5 text-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <CheckCircle2 size={14} /> Сохранено
                    </motion.span>
                  ) : (
                    <motion.span key="save">{t('stage.save')}</motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting
                  ? <Loader2 size={14} className="animate-spin" />
                  : <><Send size={14} />{rejected ? t('stage.resubmit') : t('stage.submit')}</>
                }
              </motion.button>
            </div>
          )}

          {locked && !rejected && (
            <div className="pt-4 border-t border-hl flex items-center gap-2 text-caption text-ink-tertiary">
              <Lock size={12} />
              {stageData?.status === 'APPROVED'
                ? 'Этап одобрен. Редактирование недоступно.'
                : 'Этап отправлен на проверку. Ожидайте решения администратора.'}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
