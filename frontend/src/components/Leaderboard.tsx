import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { AirplaneTilt, Trophy, Bag, Bookmark, CaretUp, CaretDown } from '@phosphor-icons/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import BarrelIcon from '@/components/BarrelIcon'
import type { LeaderboardEntry } from '@/types'

interface Props { entries: LeaderboardEntry[] }

const REWARD_ICON: Record<string, React.ReactNode> = {
  JAPAN_TRIP:        <AirplaneTilt weight="fill" size={14} className="text-accent" />,
  LEADERSHIP_AWARD:  <Trophy weight="fill" size={14} className="text-accent" />,
  BRANDED_MERCH:     <Bag weight="fill" size={14} className="text-success" />,
  PROJECT_BADGE:     <Bookmark weight="fill" size={14} className="text-ink-subtle" />,
}

const MAX_BARRELS = 20

export default function Leaderboard({ entries }: Props) {
  const { t } = useTranslation()

  if (entries.length === 0) {
    return (
      <div className="bg-s1 overflow-hidden" style={{ height: '100%' }}>
        <div className="px-6 py-16 text-center text-ink-tertiary text-body">
          {t('home.no_data')}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-s1 overflow-hidden flex flex-col" style={{ height: '100%' }}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-hl">
            <TableHead className="w-16 text-eyebrow uppercase">#</TableHead>
            <TableHead className="text-eyebrow uppercase">{t('leaderboard.participant')}</TableHead>
            <TableHead className="text-eyebrow uppercase">{t('leaderboard.barrels')}</TableHead>
            <TableHead className="text-eyebrow uppercase hidden md:table-cell">{t('leaderboard.reward')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, i) => {
            // Фейковый тренд для демонстрации анимации стрелок (в реальном проекте должен приходить с бэка)
            const trend = i % 4 === 0 ? 'up' : i % 3 === 0 ? 'down' : 'same'
            
            return (
              <motion.tr
                key={entry.userId}
                className="border-b border-hl transition-colors hover:bg-s2"
                style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(91,141,238,0.025)' }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              >
                {/* Rank & Trend */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-body font-bold text-ink">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                      className="flex items-center justify-center w-4 h-4"
                    >
                      {trend === 'up' && <CaretUp weight="bold" className="text-success" size={14} />}
                      {trend === 'down' && <CaretDown weight="bold" className="text-danger" size={14} />}
                    </motion.div>
                  </div>
                </TableCell>

                {/* Participant */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-hl">
                      <AvatarImage src={entry.avatarUrl ?? ''} alt={entry.fullName} />
                      <AvatarFallback className="bg-s2 text-ink-subtle">
                        {entry.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-body font-medium text-ink">{entry.fullName}</div>
                      {entry.position && (
                        <div className="text-caption text-ink-tertiary">{entry.position}</div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Barrels + progress */}
                <TableCell>
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <div className={`shrink-0 flex items-center gap-1.5 ${entry.totalBarrels === 0 ? 'opacity-25' : ''}`}>
                      <BarrelIcon size={18} color="var(--ink)" strokeWidth={2} />
                      {/* Анимированный текст счета: переход из черного в синий */}
                      <motion.span
                        className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-ink to-accent"
                        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        style={{ backgroundSize: '200% auto' }}
                      >
                        {entry.totalBarrels}
                      </motion.span>
                    </div>
                    <div className="flex-1 h-1.5 bg-hl rounded-pill overflow-hidden relative">
                      {/* Прогресс бар цвета нефти */}
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-ink rounded-pill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(entry.totalBarrels / MAX_BARRELS) * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 + 0.2 }}
                      />
                    </div>
                    <span className="text-caption text-ink-tertiary w-8 text-right shrink-0">
                      /{MAX_BARRELS}
                    </span>
                  </div>
                </TableCell>

                {/* Reward */}
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    {REWARD_ICON[entry.reward]}
                    <span className="text-caption text-ink-subtle">{t(`barrel.reward.${entry.reward}`)}</span>
                  </div>
                </TableCell>
              </motion.tr>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
