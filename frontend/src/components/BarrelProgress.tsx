import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Cylinder, Trophy, Bag, Medal, Star } from '@phosphor-icons/react'
import type { RewardKey } from '@/types'

interface Props {
  totalBarrels: number
  reward: RewardKey
}

const MAX = 20

const TIERS = [
  { min: 16, key: 'JAPAN_TRIP' as RewardKey,       icon: <Star weight="fill" size={14} />,   color: 'text-accent' },
  { min: 12, key: 'LEADERSHIP_AWARD' as RewardKey, icon: <Trophy weight="fill" size={14} />, color: 'text-accent'  },
  { min: 8,  key: 'BRANDED_MERCH' as RewardKey,    icon: <Bag weight="fill" size={14} />,    color: 'text-success' },
  { min: 0,  key: 'PROJECT_BADGE' as RewardKey,    icon: <Medal weight="fill" size={14} />,  color: 'text-ink-subtle' },
]

export default function BarrelProgress({ totalBarrels, reward }: Props) {
  const { t } = useTranslation()
  const pct = Math.min((totalBarrels / MAX) * 100, 100)
  const activeTier = TIERS.find((tier) => reward === tier.key)!

  return (
    <motion.div
      className="card space-y-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <p className="eyebrow mb-3 flex items-center gap-1.5">
          <Cylinder weight="regular" size={11} />
          {t('barrel.total')}
        </p>
        <div className="flex items-end justify-between mb-3">
          <motion.span
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ink to-accent drop-shadow-[0_0_12px_rgba(91,141,238,0.4)]"
            style={{ letterSpacing: '-0.03em' }}
            key={totalBarrels}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {totalBarrels}
          </motion.span>
          <span className="text-ink-tertiary text-caption">/ {MAX}</span>
        </div>

        <div className="h-1.5 bg-s3 rounded-pill overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ink to-accent shadow-[0_0_10px_rgba(91,141,238,0.5)] rounded-pill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-hl">
        <p className="eyebrow mb-2">Текущая награда</p>
        <div className={`flex items-center gap-2 ${activeTier.color}`}>
          {activeTier.icon}
          <p className="text-body font-medium text-ink">{t(`barrel.reward.${reward}`)}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {TIERS.map((tier) => {
          const isActive = reward === tier.key
          return (
            <motion.div
              key={tier.key}
              className={`flex items-center justify-between py-2 px-3 rounded-md transition-all ${
                isActive
                  ? 'bg-accent/10 border border-accent/20'
                  : 'opacity-35'
              }`}
              animate={{ opacity: isActive ? 1 : 0.35 }}
            >
              <div className={`flex items-center gap-2 ${isActive ? tier.color : 'text-ink-tertiary'}`}>
                {tier.icon}
                <span className="text-caption text-ink-muted">{t(`barrel.reward.${tier.key}`)}</span>
              </div>
              <span className={`text-caption font-medium ${isActive ? 'text-accent' : 'text-ink-tertiary'}`}>
                {tier.min}+
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
