import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle, Clock, PaperPlaneTilt, XCircle, NotePencil } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StageResponse } from '@/types'

const STAGE_META: Record<string, { label: string; deadline: string; letter: string }> = {
  D:   { label: 'Define',          deadline: '30.06.2026', letter: 'D' },
  M_A: { label: 'Measure+Analyze', deadline: '30.08.2026', letter: 'M/A' },
  I:   { label: 'Improve',         deadline: '30.11.2026', letter: 'I' },
  C:   { label: 'Control',         deadline: '20.12.2026', letter: 'C' },
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  DRAFT:     <NotePencil weight="regular" size={11} />,
  SUBMITTED: <PaperPlaneTilt weight="fill" size={11} />,
  APPROVED:  <CheckCircle weight="fill" size={11} />,
  REJECTED:  <XCircle weight="fill" size={11} />,
}

type StatusVariant = 'draft' | 'submitted' | 'approved' | 'rejected'
const STATUS_VARIANT: Record<string, StatusVariant> = {
  DRAFT:     'draft',
  SUBMITTED: 'submitted',
  APPROVED:  'approved',
  REJECTED:  'rejected',
}

interface Props { stage: StageResponse; index?: number }

export default function StageCard({ stage, index = 0 }: Props) {
  const { t } = useTranslation()
  const meta = STAGE_META[stage.stage]
  const slug = stage.stage.toLowerCase().replace('_', '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      whileHover={{ y: -1 }}
    >
      <Card className="group bg-s1/40 hover:bg-s1/80 backdrop-blur-sm border-hl/50 hover:border-accent/40 transition-all duration-300 p-6 shadow-sm hover:shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <CardContent className="p-0 relative z-10">
          <div className="flex items-center gap-5">
            {/* Stage letter badge — double-bezel */}
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-s2 to-s1 border border-hl/80 shadow-inner flex items-center justify-center group-hover:border-accent/50 group-hover:shadow-[0_0_15px_rgba(91,141,238,0.15)] transition-all duration-300">
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-br from-ink to-ink-subtle">{meta.letter}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-body font-medium text-ink truncate">{t(`stage.${stage.stage}`)}</h3>
                <Badge variant={STATUS_VARIANT[stage.status]} className="flex items-center gap-1 shrink-0">
                  {STATUS_ICON[stage.status]}
                  {t(`stage.status.${stage.status}`)}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-caption text-ink-tertiary">
                <Clock weight="regular" size={11} />
                <span>{t('stage.deadline')}: {stage.deadline ?? meta.deadline}</span>
              </div>
              {stage.adminComment && (
                <p className="mt-2 text-caption text-ink-subtle border-l-2 border-accent pl-3 line-clamp-1">
                  {stage.adminComment}
                </p>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-4">
              {stage.adminScore !== null && (
                <div className="text-right flex flex-col items-end">
                  <div 
                    className={`text-xl font-bold transition-all duration-300 ${stage.adminScore >= 80 ? 'text-accent drop-shadow-[0_0_8px_rgba(91,141,238,0.4)]' : 'text-ink'}`} 
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {stage.adminScore}%
                  </div>
                  <div className="relative w-8 h-8 mt-1 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full blur-md ${Number(stage.barrels) >= 5 ? 'bg-accent/30' : 'bg-ink/5'}`}></div>
                    <span className={`relative z-10 text-base font-bold ${Number(stage.barrels) >= 5 ? 'text-accent drop-shadow-[0_0_8px_rgba(91,141,238,0.8)]' : 'text-ink'}`}>
                      {stage.barrels}
                    </span>
                  </div>
                </div>
              )}
              <Link
                to={`/dashboard/stage/${slug}`}
                className="btn-secondary text-caption flex items-center gap-1.5 group-hover:border-hl-strong"
              >
                Открыть
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
