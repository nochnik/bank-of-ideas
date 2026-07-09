import api from './client'
import type { StageKey, StageResponse, StageFileInfo } from '@/types'

export const getMyStages = () =>
  api.get<StageResponse[]>('/stages/my').then((r) => r.data)

export const saveStageContent = (stage: StageKey, content: Record<string, unknown>) =>
  api.put<StageResponse>(`/stages/${stage}`, { content }).then((r) => r.data)

export const submitStage = (stage: StageKey) =>
  api.post<StageResponse>(`/stages/${stage}/submit`).then((r) => r.data)

export const uploadStageFile = (stage: StageKey, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<StageFileInfo>(`/stages/${stage}/files`, formData).then((r) => r.data)
}

export const deleteStageFile = (stage: StageKey, fileId: number) =>
  api.delete(`/stages/${stage}/files/${fileId}`).then((r) => r.data)
