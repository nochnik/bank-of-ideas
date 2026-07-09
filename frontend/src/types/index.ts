export type Role = 'ADMIN' | 'PARTICIPANT'
export type StageKey = 'D' | 'M_A' | 'I' | 'C'
export type StageStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
export type RewardKey = 'JAPAN_TRIP' | 'LEADERSHIP_AWARD' | 'BRANDED_MERCH' | 'PROJECT_BADGE'

export interface UserProfile {
  id: number
  username: string
  fullName: string
  position: string | null
  avatarUrl: string | null
  role: Role
}

export interface StageFileInfo {
  id: number
  fileName: string
  fileUrl: string
  fileSize: number
  contentType: string
  uploadedAt: string
}

export interface StageResponse {
  id: number
  stage: StageKey
  content: Record<string, unknown>
  status: StageStatus
  adminScore: number | null
  adminComment: string | null
  deadline: string | null
  submittedAt: string | null
  reviewedAt: string | null
  barrels: number
  files: StageFileInfo[]
  ownerId: number | null
  ownerFullName: string | null
}

export interface LeaderboardEntry {
  userId: number
  fullName: string
  avatarUrl: string | null
  position: string | null
  totalBarrels: number
  reward: RewardKey
}

export interface StageProgressItem {
  stage: StageKey
  status: StageStatus
  score: number | null
  submittedAt: string | null
}

export interface ParticipantProgress {
  userId: number
  fullName: string
  position: string | null
  avatarUrl: string | null
  stages: StageProgressItem[]
  totalBarrels: number
}

export interface AdminDashboard {
  totalParticipants: number
  totalStagesSubmitted: number
  totalStagesApproved: number
  totalStagesRejected: number
  totalStagesDraft: number
  participants: ParticipantProgress[]
}
