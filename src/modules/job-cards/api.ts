import apiClient from '../../lib/apiClient'
import type { CompleteJobCardPayload, CreateJobCardPayload, UpdateJobCardPayload } from './schemas'
import type { JobCard, JobCardListResponse, JobCardStatus } from './types'

interface JobCardListParams {
  page: number
  limit: number
  search?: string
  status?: JobCardStatus
}

const getJobCards = async (params: JobCardListParams): Promise<JobCardListResponse> => {
  const response = await apiClient.get('/api/job-cards', { params })
  return response.data.data
}

const getJobCard = async (jobCardId: string): Promise<JobCard> => {
  const response = await apiClient.get(`/api/job-cards/${jobCardId}`)
  return response.data.data
}

const createJobCard = async (payload: CreateJobCardPayload) => {
  const response = await apiClient.post('/api/job-cards', payload)
  return response.data.data
}

const updateJobCard = async (jobCardId: string, payload: UpdateJobCardPayload | CompleteJobCardPayload) => {
  const response = await apiClient.patch(`/api/job-cards/${jobCardId}`, payload)
  return response.data.data
}

const deleteJobCard = async (jobCardId: string) => {
  const response = await apiClient.delete(`/api/job-cards/${jobCardId}`)
  return response.data
}

const updateJobCardStatus = async (jobCardId: string, status: JobCardStatus) => {
  const response = await apiClient.patch(`/api/job-cards/${jobCardId}/status`, { status })
  return response.data.data
}

export { createJobCard, deleteJobCard, getJobCard, getJobCards, updateJobCard, updateJobCardStatus }
export type { JobCardListParams }
