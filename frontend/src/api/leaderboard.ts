import api from './client'
import type { LeaderboardEntry } from '@/types'

export const getLeaderboard = () =>
  api.get<LeaderboardEntry[]>('/leaderboard').then((r) => r.data)
