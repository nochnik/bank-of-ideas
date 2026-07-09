import { useTranslation } from 'react-i18next'
import { Target, BarChart2, Zap, CheckCircle2 } from 'lucide-react'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'

const DMAIC_DATA = [
  {
    id: 1,
    title: 'D — Define',
    date: '30.06.2026',
    content: 'Определение проблемы и целей проекта. Составление устава проекта, карты процесса и голоса клиента (VOC).',
    category: 'Define',
    icon: Target,
    relatedIds: [2],
    status: 'in-progress' as const,
    energy: 65,
  },
  {
    id: 2,
    title: 'M/A — Measure',
    date: '30.08.2026',
    content: 'Сбор и анализ данных. Измерение текущего состояния процесса, выявление коренных причин отклонений.',
    category: 'Measure',
    icon: BarChart2,
    relatedIds: [1, 3],
    status: 'pending' as const,
    energy: 30,
  },
  {
    id: 3,
    title: 'I — Improve',
    date: '30.11.2026',
    content: 'Разработка и внедрение решений. Оптимизация процесса на основе данных анализа, пилотное тестирование.',
    category: 'Improve',
    icon: Zap,
    relatedIds: [2, 4],
    status: 'pending' as const,
    energy: 15,
  },
  {
    id: 4,
    title: 'C — Control',
    date: '20.12.2026',
    content: 'Контроль и закрепление результатов. Разработка плана управления, документирование улучшений.',
    category: 'Control',
    icon: CheckCircle2,
    relatedIds: [3],
    status: 'pending' as const,
    energy: 5,
  },
]

import { ArrowRight } from 'lucide-react'

export default function DMAICTimeline() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center bg-s1 rounded-[2rem] border border-hl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
      {/* Unified Grid pattern for the entire section */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(150,150,150,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(150,150,150,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Background glow for the whole section */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      {/* Left text column */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center relative z-10">
        <p className="eyebrow mb-3 text-accent uppercase">
          {t('timeline.section_label')}
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 3.5vw, 3rem)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          lineHeight: 1.1,
          marginBottom: '24px',
          fontFamily: 'Gilroy, sans-serif'
        }}>
          {t('timeline.section_title')}
        </h2>
        <p className="text-body text-ink-subtle mb-8 leading-relaxed">
          Управление проектом построено на классической методологии Six Sigma. Каждый этап открывается последовательно после проверки экспертом и приносит вам баррели.
        </p>
        
        {/* Step indicators */}
        <div className="flex flex-col gap-3">
          {DMAIC_DATA.map((step) => (
            <div key={step.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-hl/30 transition-colors border border-transparent hover:border-hl cursor-default">
              <div className="w-10 h-10 rounded-full bg-s2 border border-hl flex items-center justify-center text-ink shrink-0">
                <step.icon size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">{step.title}</h4>
                <p className="text-xs text-ink-subtle mt-0.5 font-mono">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right orbital timeline */}
      <div className="w-full lg:w-2/3 h-[500px] lg:h-[650px] relative z-10 flex items-center justify-center">
        <RadialOrbitalTimeline timelineData={DMAIC_DATA} />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-s1/80 backdrop-blur-md border border-hl text-xs text-ink-subtle flex items-center gap-2 pointer-events-none">
          <ArrowRight size={14} className="text-accent" />
          Нажмите на узел для деталей
        </div>
      </div>
    </div>
  )
}
