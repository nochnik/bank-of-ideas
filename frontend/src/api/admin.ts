import api from './client'
import type { StageResponse, UserProfile, AdminDashboard } from '@/types'

export interface CreateUserPayload {
  username: string
  password: string
  fullName: string
  position?: string
}

export const createUser = (payload: CreateUserPayload) =>
  api.post<UserProfile>('/admin/users', payload).then((r) => r.data)

export const getAllUsers = () =>
  api.get<UserProfile[]>('/admin/users').then((r) => r.data)

export const getSubmittedStages = () =>
  api.get<StageResponse[]>('/admin/stages/submitted').then((r) => r.data)

export const reviewStage = (stageId: number, score: number, comment?: string) =>
  api.put<StageResponse>(`/admin/stages/${stageId}/review`, { score, comment }).then((r) => r.data)

export const rejectStage = (stageId: number, comment: string) =>
  api.put<StageResponse>(`/admin/stages/${stageId}/reject`, { comment }).then((r) => r.data)

export const getAdminDashboard = () =>
  api.get<AdminDashboard>('/admin/dashboard').then((r) => r.data)

export const getUserStages = (userId: number) =>
  api.get<StageResponse[]>(`/admin/users/${userId}/stages`).then((r) => r.data)
