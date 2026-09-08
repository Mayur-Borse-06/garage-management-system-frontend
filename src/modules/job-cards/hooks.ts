import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { createJobCard, deleteJobCard, getJobCard, getJobCards, updateJobCard, updateJobCardStatus, type JobCardListParams } from './api'
import type { CompleteJobCardPayload, CreateJobCardPayload, UpdateJobCardPayload } from './schemas'
import type { JobCardStatus } from './types'

const jobCardsQueryKey = ['job-cards']

const errorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error) && typeof error.response?.data?.message === 'string' ? error.response.data.message : fallback

const useJobCardsData = (params: JobCardListParams) =>
  useQuery({ queryKey: [...jobCardsQueryKey, params], queryFn: () => getJobCards(params) })

const useJobCardData = (jobCardId: string) =>
  useQuery({ queryKey: [...jobCardsQueryKey, jobCardId], queryFn: () => getJobCard(jobCardId), enabled: Boolean(jobCardId) })

const useCreateJobCard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateJobCardPayload) => createJobCard(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: jobCardsQueryKey }); toast.success('Job card created successfully!') },
    onError: (error) => toast.error(errorMessage(error, 'Unable to create job card. Please try again.')),
  })
}

const useUpdateJobCard = (jobCardId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateJobCardPayload | CompleteJobCardPayload) => updateJobCard(jobCardId, payload),
    onSuccess: async (_data, payload) => {
      await queryClient.refetchQueries({ queryKey: jobCardsQueryKey, type: 'active' })
      toast.success(payload.status === 'COMPLETED' ? 'Job card completed and invoice generated successfully!' : 'Job card updated successfully!')
    },
    onError: (error) => toast.error(errorMessage(error, 'Unable to update job card. Please try again.')),
  })
}

const useDeleteJobCard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobCardId: string) => deleteJobCard(jobCardId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: jobCardsQueryKey }); toast.success('Job card deactivated successfully!') },
    onError: (error) => toast.error(errorMessage(error, 'Unable to deactivate job card. Please try again.')),
  })
}

interface UpdateJobCardStatusVariables {
  jobCardId: string
  status: JobCardStatus
}

const useUpdateJobCardStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ jobCardId, status }: UpdateJobCardStatusVariables) => updateJobCardStatus(jobCardId, status),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: jobCardsQueryKey, type: 'active' })
      toast.success('Job card status updated successfully!')
    },
    onError: (error) => toast.error(errorMessage(error, 'Unable to update job card status. Please try again.')),
  })
}

export { useCreateJobCard, useDeleteJobCard, useJobCardData, useJobCardsData, useUpdateJobCard, useUpdateJobCardStatus }
